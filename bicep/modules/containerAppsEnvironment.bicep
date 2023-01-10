param name string = '${resourceGroup().name}-containerappsenv'
param location string = resourceGroup().location
param logAnalyticsWorkspaceId string

resource containerAppEnv 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: name
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: reference(logAnalyticsWorkspaceId, '2020-08-01').customerId
        sharedKey: listKeys(logAnalyticsWorkspaceId, '2020-08-01').primarySharedKey
      }
    }
  }
}

output resourceId string = containerAppEnv.id
