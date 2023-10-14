Param([switch]$WhatIf = $False)

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

Write-Step "Fetch params from Azure"
$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString
$sharedResourceVars = Get-SharedResourceDeploymentVars $sharedResourceGroupName $sharedRgString

$secrectCharRevealLength = 10

$data = [ordered]@{
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
