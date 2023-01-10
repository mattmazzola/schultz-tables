$resourceGroupName = "wov"
$resourceGroupLocation = "westus3"

Import-Module "$PSScriptRoot/common.psm1" -Force

Write-Step "Query params from Azure"
$logAnalyticsCustomerId = $(az containerapp env show -g $resourceGroupName -n wov-containerappsenv --query "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId" -o tsv)
$logAnalyticsSharedKey = $(az monitor log-analytics workspace get-shared-keys -g $resourceGroupName -n "$resourceGroupName-loganalytics" --query "primarySharedKey" -o tsv)

$data = [ordered]@{
  "logAnalyticsCustomerId" = $logAnalyticsCustomerId
  "logAnalyticsSharedKey"  = $logAnalyticsSharedKey.Substring(0, 5)
}

Write-Hash "Data" $data
az deployment group create `
  -g $resourceGroupName `
  -f ./bicep/modules/containerAppsEnv.bicep `
  -p logAnalyticsCustomerId=$logAnalyticsCustomerId `
  logAnalyticsSharedKey=$logAnalyticsSharedKey
