var uniqueRgString = take(uniqueString(subscription().id, resourceGroup().id), 6)

module sqlDatabase 'modules/sqlDatabase.bicep' = {
  name: 'sqlDatabaseModule'
  params: {
    uniqueRgString: uniqueRgString
  }
}
