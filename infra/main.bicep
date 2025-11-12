targetScope = 'subscription'

param environmentName string
param location string

param sharedResourceGroupName string
param sharedContainerAppsEnvironmentName string
param sharedAcrName string

param resourceGroupName string
param containerAppName string = '${resourceGroupName}-client'

resource sharedRg 'Microsoft.Resources/resourceGroups@2025-04-01' existing= {
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
