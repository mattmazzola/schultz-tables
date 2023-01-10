param location string = 'westus3'

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'wov-keyvault'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: '61f2e65a-a249-4aaa-82bb-248830f89177'
    accessPolicies: [
      {
        tenantId: '61f2e65a-a249-4aaa-82bb-248830f89177'
        objectId: 'ff05dde2-c18e-47fc-9ad2-ebf0c9efb3a0'
        permissions: {
          keys: [
            'All'
          ]
          secrets: [
            'All'
          ]
          certificates: [
            'All'
          ]
        }
      }
    ]
  }
}

module database 'modules/database.bicep' = {
  name: 'databaseModule'
  params: {
    keyVaultName: keyVault.name
  }
}

module containerRegistry 'modules/containerRegistry.bicep' = {
  name: 'containerRegistry'
}

module logAnalytics 'modules/logAnalyticsWorkspace.bicep' = {
  name: 'logAnalytics'
}

module containerAppsEnv 'modules/containerAppsEnvironment.bicep' = {
  name: 'containerAppsEnv'
  params: {
    logAnalyticsWorkspaceId: logAnalytics.outputs.logAnalyticsId
  }
}
