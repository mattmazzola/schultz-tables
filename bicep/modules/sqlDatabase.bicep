param uniqueRgString string

// global	1-63	Lowercase letters, numbers, and hyphens.
// https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules#microsoftsql
@minLength(1)
@maxLength(63)
param serverName string = '${resourceGroup().name}-${uniqueRgString}-sql-server'

param projectName string = 'schultz-tables'

@minLength(1)
@maxLength(128)
param dbName string = '${resourceGroup().name}-${uniqueRgString}-sql-db-${projectName}'
var shadowDbName = '${dbName}-shadow'

param location string = resourceGroup().location

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' existing = {
  name: serverName
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  location: location
  name: dbName
  properties: {
    autoPauseDelay: 60
    minCapacity: any('0.5')
  }
  sku: {
    name: 'GP_S_Gen5_1'
  }
}

resource sqlShadowDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  location: location
  name: shadowDbName
  properties: {
    autoPauseDelay: 60
    minCapacity: any('0.5')
  }
  sku: {
    // View all possible SKU names
    // az sql db list-editions -l westus3 -o table
    name: 'GP_S_Gen5_1'
  }
}
