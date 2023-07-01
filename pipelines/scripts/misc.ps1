$resourceGroupName = "schultztables"
$resourceGroupLocation = "westus3"

echo "PScriptRoot: $PScriptRoot"
$repoRoot = If ('' -eq $PScriptRoot) {
  "$PSScriptRoot/.."
}
else {
  "."
}

echo "Repo Root: $repoRoot"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

Write-Step "Get ENV Vars from file"
$envFilePath = $(Resolve-Path "$repoRoot/.env").Path
$clerkPublishableKey = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'CLERK_PUBLISHABLE_KEY'
$clerkPublishableKey

$imageTag = $(az acr repository show-tags -n $sharedResourceNames.containerRegistry --repository "$schultzTablesResourceGroupName-client" --top 1 --orderby time_desc -o tsv)
