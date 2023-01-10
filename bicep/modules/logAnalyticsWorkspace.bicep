param name string = '${resourceGroup().name}-loganalytics'
param location string = resourceGroup().location

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: name
  location: location
}

output logAnalyticsId string = logAnalyticsWorkspace.id
