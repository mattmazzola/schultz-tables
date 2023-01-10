param name string = '${resourceGroup().name}-containerapp-service'
param location string = resourceGroup().location

param managedEnvironmentResourceId string
param imageName string
param containerName string
param registryUrl string
param registryUsername string
@secure()
param registryPassword string

param databaseAccountUrl string
@secure()
param databaseKey string

var registryPassworldSecretName = 'container-registry-password'
var databaseKeySecretName = 'db-key'

resource containerApp 'Microsoft.App/containerapps@2022-03-01' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: managedEnvironmentResourceId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 80
      }
      registries: [
        {
          server: registryUrl
          username: registryUsername
          passwordSecretRef: registryPassworldSecretName
        }
      ]
      secrets: [
        {
          name: registryPassworldSecretName
          value: registryPassword
        }
        {
          name: databaseKeySecretName
          value: databaseKey
        }
      ]
    }
    template: {
      containers: [
        {
          image: imageName
          name: containerName
          resources: {
            cpu: any('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'development'
            }
            {
              name: 'HOST'
              value: '0.0.0.0'
            }
            {
              name: 'PORT'
              value: '80'
            }
            {
              name: 'COSMOSDB_ACCOUNT'
              value: databaseAccountUrl
            }
            {
              name: 'COSMOSDB_KEY'
              secretRef: databaseKeySecretName
            }
            {
              name: 'COSMOSDB_DATABASE_ID'
              value: 'valorantwomen'
            }
            {
              name: 'COSMOSDB_CONTAINER_ID'
              value: 'ratings'
            }
            {
              name: 'DAPR_HOST'
              value: 'localhost'
            }
            {
              name: 'DAPR_HTTP_PORT'
              value: '3500'
            }
          ]
          probes: [
            {
              type: 'Startup'
              httpGet: {
                path: '/info/routes'
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
