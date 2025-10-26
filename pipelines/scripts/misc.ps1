$resourceGroupName = "schultztables"
$resourceGroupLocation = "westus3"

Write-Output "PScriptRoot: $PScriptRoot"
$repoRoot = If ('' -eq $PScriptRoot) {
  "$PSScriptRoot/.."
}
else {
  "."
}

Write-Output "Repo Root: $repoRoot"

Import-Module "$repoRoot/../shared-resources/pipelines/scripts/common.psm1" -Force

$inputs = @{
  "WhatIf" = $WhatIf
}

Write-Hash "Inputs" $inputs

$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$schultzTablesResourceGroupName = "schultztables"

Write-Step "Get ENV Vars from file"
$envFilePath = $(Resolve-Path "$repoRoot/.env").Path
$clerkPublishableKey = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'CLERK_PUBLISHABLE_KEY'
$clerkPublishableKey

Write-Step "Fetch params from Azure"
$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString

$imageTag = $(az acr repository show-tags -n $sharedResourceNames.containerRegistry --repository "$schultzTablesResourceGroupName-client" --top 1 --orderby time_desc -o tsv)
$imageTag
