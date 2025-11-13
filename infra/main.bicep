targetScope = 'subscription'

param environmentName string
param location string

param sharedResourceGroupName string
param sharedContainerAppsEnvironmentName string
param sharedAcrName string

param resourceGroupName string

param clerkPublishableKey string
@secure()
param clerkSecretKey string

@secure()
param cookieSecret string

@secure()
param databaseUrl string

resource sharedRg 'Microsoft.Resources/resourceGroups@2025-04-01' existing = {
  name: sharedResourceGroupName
}

var uniqueRgString = take(uniqueString(sharedRg.id), 6)

resource sharedContainerAppsEnv 'Microsoft.App/managedEnvironments@2025-02-02-preview' existing = {
  name: sharedContainerAppsEnvironmentName
  scope: sharedRg
}

resource sharedAcr 'Microsoft.ContainerRegistry/registries@2025-05-01-preview' existing = {
  name: sharedAcrName
  scope: sharedRg
}

module sqlDatabase 'modules/sqlDatabase.bicep' = {
  name: 'sqlDatabaseModule'
  scope: sharedRg
  params: {
    uniqueRgString: uniqueRgString
  }
}

var tags = {
  'azd-env-name': '${resourceGroupName}-${environmentName}' // e.g., "shared-dev", "shared-prod"
  project: resourceGroupName
}

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

var defaultImageName = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

param containerAppName string = '${resourceGroupName}-client'
param containerAppImageName string = ''

module clientContainerApp 'modules/clientContainerApp.bicep' = {
  name: 'clientContainerAppModule'
  scope: rg
  params: {
    name: containerAppName
    location: location
    tags: union(tags, { 'azd-service-name': 'site' })
    imageName: !empty(containerAppImageName) ? containerAppImageName : defaultImageName
    managedEnvironmentResourceId: sharedContainerAppsEnv.id
    containerName: containerAppName
    registryUsername: sharedAcr.name
    registryPassword: sharedAcr.listCredentials().passwords[0].value
    clerkPublishableKey: clerkPublishableKey
    clerkSecretKey: clerkSecretKey
    cookieSecret: cookieSecret
    databaseUrl: databaseUrl
  }
}

// Outputs required by azd
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = rg.name

// Outputs for the services
output SERVICE_CLIENT_NAME string = clientContainerApp.outputs.name
output SERVICE_CLIENT_ENDPOINT string = clientContainerApp.outputs.appUrl
