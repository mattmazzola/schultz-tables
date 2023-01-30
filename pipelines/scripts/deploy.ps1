$sharedResourceGroupName = "shared"
$sharedRgString = 'klgoyi'
$resourceGroupLocation = "westus3"
$schultzTablesResourceGroupName = "schultztables"

echo "PScriptRoot: $PScriptRoot"
$repoRoot = If ('' -eq $PScriptRoot) {
  "$PSScriptRoot/../.."
}
else {
  "."
}

echo "Repo Root: $repoRoot"

Import-Module "C:/repos/shared-resources/pipelines/scripts/common.psm1" -Force

Write-Step "Create Resource Group"
az group create -l $resourceGroupLocation -g $schultzTablesResourceGroupName --query name -o tsv

$envFilePath = $(Resolve-Path "$repoRoot/.env").Path
Write-Step "Get ENV Vars from: $envFilePath"
$auth0ReturnToUrl = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_RETURN_TO_URL'
$auth0CallbackUrl = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_CALLBACK_URL'
$auth0ClientId = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_CLIENT_ID'
$auth0ClientSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_CLIENT_SECRET'
$auth0Domain = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_DOMAIN'
$auth0LogoutUrl = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_LOGOUT_URL'
$auth0ManagementClientId = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_MANAGEMENT_APP_CLIENT_ID'
$auth0ManagementClientSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'AUTH0_MANAGEMENT_APP_CLIENT_SECRET'
$cookieSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'COOKIE_SECRET'
$databaseUrlSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'DATABASE_URL'
$shadowDatabaseUrlSecret = Get-EnvVarFromFile -envFilePath $envFilePath -variableName 'SHADOW_DATABASE_URL'

Write-Step "Fetch params from Azure"
$sharedResourceNames = Get-ResourceNames $sharedResourceGroupName $sharedRgString

$containerAppsEnvResourceId = $(az containerapp env show -g $sharedResourceGroupName -n $sharedResourceNames.containerAppsEnv --query "id" -o tsv)
$acrJson = $(az acr credential show -n $sharedResourceNames.containerRegistry --query "{ username:username, password:passwords[0].value }" | ConvertFrom-Json)
$registryUrl = $(az acr show -g $sharedResourceGroupName -n $sharedResourceNames.containerRegistry --query "loginServer" -o tsv)
$registryUsername = $acrJson.username
$registryPassword = $acrJson.password

$clientContainerName = "$schultzTablesResourceGroupName-client"
$clientImageTag = $(Get-Date -Format "yyyyMMddhhmm")
$clientImageName = "${registryUrl}/${clientContainerName}:${clientImageTag}"

$data = [ordered]@{
  "auth0ReturnToUrl"            = $auth0ReturnToUrl
  "auth0CallbackUrl"            = $auth0CallbackUrl
  "auth0ClientId"               = $auth0ClientId
  "auth0ClientSecret"           = "$($auth0ClientSecret.Substring(0, 5))..."
  "auth0Domain"                 = $auth0Domain
  "auth0LogoutUrl"              = $auth0LogoutUrl
  "auth0ManagementClientId"     = $auth0ManagementClientId
  "auth0ManagementClientSecret" = "$($auth0ManagementClientSecret.Substring(0, 5))..."

  "cookieSecret"                = "$($cookieSecret.Substring(0, 5))..."
  "databaseUrlSecret"           = "$($databaseUrlSecret.Substring(0, 5))..."
  "shadowDatabaseUrlSecret"     = "$($shadowDatabaseUrlSecret.Substring(0, 5))..."

  "clientImageName"             = $clientImageName

  "containerAppsEnvResourceId"  = $containerAppsEnvResourceId
  "registryUrl"                 = $registryUrl
  "registryUsername"            = $registryUsername
  "registryPassword"            = "$($registryPassword.Substring(0, 5))..."
}

Write-Hash "Data" $data

Write-Step "Build and Push $clientImageName Image"
az acr build -r $registryUrl -t $clientImageName ./client-remix

Write-Step "Deploy $clientImageName Container App"
$clientBicepContainerDeploymentFilePath = "$repoRoot/bicep/modules/clientContainerApp.bicep"
$clientFqdn = $(az deployment group create `
    -g $schultzTablesResourceGroupName `
    -f $clientBicepContainerDeploymentFilePath `
    -p managedEnvironmentResourceId=$containerAppsEnvResourceId `
    registryUrl=$registryUrl `
    registryUsername=$registryUsername `
    registryPassword=$registryPassword `
    imageName=$clientImageName `
    containerName=$clientContainerName `
    auth0ReturnToUrl=$auth0ReturnToUrl `
    auth0CallbackUrl=$auth0CallbackUrl `
    auth0ClientId=$auth0ClientId `
    auth0ClientSecret=$auth0ClientSecret `
    auth0Domain=$auth0Domain `
    auth0LogoutUrl=$auth0LogoutUrl `
    auth0managementClientId=$auth0managementClientId `
    auth0managementClientSecret=$auth0managementClientSecret `
    databaseUrl=$databaseUrlSecret `
    shadowDatabaseUrl=$shadowDatabaseUrlSecret `
    cookieSecret=$cookieSecret `
    --query "properties.outputs.fqdn.value" `
    -o tsv)

$clientUrl = "https://$clientFqdn"
Write-Output $clientUrl
