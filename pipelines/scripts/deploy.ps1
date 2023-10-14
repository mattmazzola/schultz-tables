Param([switch]$WhatIf = $True)

echo "PScriptRoot: $PScriptRoot"
$repoRoot = if ('' -eq $PScriptRoot) {
  "$PSScriptRoot/../.."
} else {
  "."
}

echo "Repo Root: $repoRoot"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

$inputs = @{
  "WhatIf" = $WhatIf
}

Write-Hash "Inputs" $inputs

$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$schultzTablesResourceGroupName = "schultztables"

$envFilePath = $(Resolve-Path "$repoRoot/.env").Path
Write-Step "Get ENV Vars from: $envFilePath"
$clerkPublishableKey = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'CLERK_PUBLISHABLE_KEY'
$clerkSecretKey = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'CLERK_SECRET_KEY'
$cookieSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'COOKIE_SECRET'
$databaseUrlSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'DATABASE_URL'

Write-Step "Fetch params from Azure"
$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

$clientContainerName = "$schultzTablesResourceGroupName-client"
$clientImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$clientImageName = "$($sharedResourceVars.registryUrl)/${clientContainerName}:${clientImageTag}"
$secrectCharRevealLength = 10

$data = [ordered]@{
  "clerkPublishableKey"         = $clerkPublishableKey
  "clerkSecretKey"              = "$($clerkSecretKey.Substring(0, $secrectCharRevealLength))..."

  "cookieSecret"                = "$($cookieSecret.Substring(0, $secrectCharRevealLength))..."
  "databaseUrlSecret"           = "$($databaseUrlSecret.Substring(0, $secrectCharRevealLength))..."

  "clientImageName"             = $clientImageName

  "containerAppsEnvResourceId"  = $($sharedResourceVars.containerAppsEnvResourceId)
  "registryUrl"                 = $($sharedResourceVars.registryUrl)
  "registryUsername"            = $($sharedResourceVars.registryUsername)
  "registryPassword"            = "$($($sharedResourceVars.registryPassword).Substring(0, $secrectCharRevealLength))..."
}

Write-Hash "Data" $data

Write-Step "Provision Additional $sharedResourceGroupName Resources (What-If: $($WhatIf))"
$mainBicepFilePath = "$repoRoot/bicep/main.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFilePath `
    --what-if
} else {
  az deployment group create `
    -g $sharedResourceGroupName `
    -f $mainBicepFilePath `
    --query "properties.provisioningState" `
    -o tsv
}

Write-Step "Create Resource Group $schultzTablesResourceGroupName"
az group create -l $resourceGroupLocation -g $schultzTablesResourceGroupName --query name -o tsv

Write-Step "Provision $schultzTablesResourceGroupName Resources (What-If: $($WhatIf))"

Write-Step "Build $clientImageName Image (What-If: $($WhatIf))"
docker build -t $clientImageName "$repoRoot/client-remix"

if ($WhatIf -eq $False) {
  Write-Step "Push $clientImageName Image (What-If: $($WhatIf))"
  docker push $clientImageName
}
else {
  Write-Step "Skipping Push $clientImageName Image (What-If: $($WhatIf))"
}

Write-Step "Get Top Image from $($sharedResourceVars.registryUrl) respository $clientContainerName to Verify Push (What-If: $($WhatIf))"
az acr repository show-tags --name $($sharedResourceVars.registryUrl) --repository $clientContainerName --orderby time_desc --top 1 -o tsv

Write-Step "Deploy $clientImageName Container App (What-If: $($WhatIf))"
$clientBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/clientContainerApp.bicep"

if ($WhatIf -eq $True) {
  az deployment group create `
    -g $schultzTablesResourceGroupName `
    -f $clientBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
    registryUrl=$($sharedResourceVars.registryUrl) `
    registryUsername=$($sharedResourceVars.registryUsername) `
    registryPassword=$($sharedResourceVars.registryPassword) `
    imageName=$clientImageName `
    containerName=$clientContainerName `
    clerkPublishableKey=$clerkPublishableKey `
    clerkSecretKey=$clerkSecretKey `
    databaseUrl=$databaseUrlSecret `
    cookieSecret=$cookieSecret `
    --what-if
}
else {
  $clientFqdn = $(az deployment group create `
      -g $schultzTablesResourceGroupName `
      -f $clientBicepContainerDeploymentFilePath `
      -p managedEnvironmentResourceId=$($sharedResourceVars.containerAppsEnvResourceId) `
      registryUrl=$($sharedResourceVars.registryUrl) `
      registryUsername=$($sharedResourceVars.registryUsername) `
      registryPassword=$($sharedResourceVars.registryPassword) `
      imageName=$clientImageName `
      containerName=$clientContainerName `
      clerkPublishableKey=$clerkPublishableKey `
      clerkSecretKey=$clerkSecretKey `
      databaseUrl=$databaseUrlSecret `
      cookieSecret=$cookieSecret `
      --query "properties.outputs.fqdn.value" `
      -o tsv)

  $clientUrl = "https://$clientFqdn"
  Write-Output $clientUrl
}
