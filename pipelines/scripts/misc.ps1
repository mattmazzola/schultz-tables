$resourceGroupName = "schultztables"
$resourceGroupLocation = "westus3"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

Write-Step "Get ENV Vars from file"
$envFilePath = $(Resolve-Path "$PSScriptRoot/../../.env").Path
$auth0ReturnToUrl = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_RETURN_TO_URL'
$auth0ReturnToUrl

$imageTag = $(az acr repository show-tags -n $sharedResourceNames.containerRegistry --repository "$schultzTablesResourceGroupName-client" --top 1 --orderby time_desc -o tsv)
