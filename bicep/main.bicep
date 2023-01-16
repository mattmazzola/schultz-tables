param auth0CallbackUrl string
param auth0ClientId string

@secure()
param auth0ClientSecret string
param auth0Domain string
param auth0Logout string
param auth0ReturnToUrl string
param auth0managementClientId string
@secure()
param auth0managementClientSecret string

@secure()
param cookieSecret string
param containerName string
param imageName string
param registryUrl string
param registryUsername string
@secure()
param registryPassword string
param managedEnvironmentResourceId string

module containerApp 'modules/clientContainerApp.bicep' = {
  name: 'clientContainerApp'
  params: {
    auth0CallbackUrl: auth0CallbackUrl
    auth0ClientId: auth0ClientId
    auth0ClientSecret: auth0ClientSecret
    auth0Domain: auth0Domain
    auth0Logout: auth0Logout
    auth0ReturnToUrl: auth0ReturnToUrl
    auth0managementClientId: auth0managementClientId
    auth0managementClientSecret: auth0managementClientSecret
    cookieSecret: cookieSecret
    containerName: containerName
    imageName: imageName
    registryUrl: registryUrl
    registryUsername: registryUsername
    registryPassword: registryPassword
    managedEnvironmentResourceId: managedEnvironmentResourceId
  }
}
