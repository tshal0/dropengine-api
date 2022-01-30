# Initializes the KeyVault used by this service

param ($service='dropengine', $location='eastus', $env='prod', $iteration='001')


$rgService = "rg-$service-$env"
$kvName = "kv-$service-$env"

if ($(az group list --query "[?name=='$rgService'] | length(@)") -eq 0)
{
  az group create --name $rgService --location $location
}

# keyvault (kv)
Write-Output "################# DEPLOYING KEYVAULT ##################"
Write-Output "ResourceGroup - KeyVaults     $rgService"
Write-Output "KeyVault:                     $kvName"

az deployment group create --resource-group $rgService --template-file .\modules\kv\kv.template.bicep --parameters .\modules\kv\kv.parameters.prod.ignore.json --parameters kvName=$kvName
Write-Output "################# FINISHED DEPLOYING KEYVAULT ##################"