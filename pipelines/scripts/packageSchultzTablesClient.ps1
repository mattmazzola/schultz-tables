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

Write-Step "Fetch params from Azure"
$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

$clientContainerName = "$schultzTablesResourceGroupName-client"
$clientImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$clientImageName = "$($sharedResourceVars.registryUrl)/${clientContainerName}:${clientImageTag}"
$secrectCharRevealLength = 10

$data = [ordered]@{
  "clientImageName"             = $clientImageName

  "registryUrl"                 = $($sharedResourceVars.registryUrl)
  "registryUsername"            = $($sharedResourceVars.registryUsername)
  "registryPassword"            = "$($($sharedResourceVars.registryPassword).Substring(0, $secrectCharRevealLength))..."
}

Write-Hash "Data" $data

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
