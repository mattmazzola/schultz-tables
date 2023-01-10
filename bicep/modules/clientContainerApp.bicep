param name string = '${resourceGroup().name}-containerapp-client'
param location string = resourceGroup().location
param managedEnvironmentResourceId string

param imageName string
param containerName string
param apiUrl string

param auth0ReturnToUrl string
param auth0CallbackUrl string
param auth0ClientId string
@secure()
param auth0ClientSecret string
param auth0Domain string
param auth0Logout string
@secure()
param cookieSecret string

param registryUrl string
param registryUsername string
@secure()
param registryPassword string

var registryPasswordName = 'container-registry-password'
var auth0clientSecretName = 'auth0-client-secret'
var cookieSecretName = 'cookie-secret'

resource containerApp 'Microsoft.App/containerapps@2022-03-01' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: managedEnvironmentResourceId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8080
      }
      registries: [
        {
          server: registryUrl
          username: registryUsername
          passwordSecretRef: registryPasswordName
        }
      ]
      secrets: [
        {
          name: registryPasswordName
          value: registryPassword
        }
        {
          name: auth0clientSecretName
          value: auth0ClientSecret
        }
        {
          name: cookieSecretName
          value: cookieSecret
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: containerName
          // https://learn.microsoft.com/en-us/azure/container-apps/containers#configuration
          resources: {
            cpu: any('0.5')
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'API_URL'
              value: apiUrl
            }
            {
              name: 'AUTH0_RETURN_TO_URL'
              value: auth0ReturnToUrl
            }
            {
              name: 'AUTH0_CALLBACK_URL'
              value: auth0CallbackUrl
            }
            {
              name: 'AUTH0_CLIENT_ID'
              value: auth0ClientId
            }
            {
              name: 'AUTH0_CLIENT_SECRET'
              secretRef: auth0clientSecretName
            }
            {
              name: 'AUTH0_DOMAIN'
              value: auth0Domain
            }
            {
              name: 'AUTH0_LOGOUT_URL'
              value: auth0Logout
            }
            {
              name: 'COOKIE_SECRET'
              secretRef: cookieSecretName
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/'
                port: 80
              }
            }
          ] 
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

output fqdn string = containerApp.properties.configuration.ingress.fqdn
