
param ($service = 'dropengine', $location = 'eastus', $env = 'prod')

# Generate ResourceGroup, KeyVault resource names
$rgService = "rg-$service-$env"
$kvName = "kv-$service-$env"

# Initialize the resource group if not exists
if ($(az group list --query "[?name=='$rgService'] | length(@)") -eq 0) {
  Write-Output "################# DEPLOYING AZURE RESOURCE GROUP '$rgService' ##################"
  az group create --name $rgService --location $location
}



# Deploy Service
Write-Output "################# DEPLOYING SERVICE ##################"
Write-Output "ResourceGroup - Service      $rgService"
Write-Output "KeyVault                     $kvName"
$result = az deployment group create --resource-group $rgService --template-file .\main.template.bicep --parameters .\main.template.parameters.prod.json --parameters service=$service env=$env location=$location | ConvertFrom-Json
Write-Output "Result -  $result"
Write-Output "Outputs -  $result.properties.outputs"

# Extract PostgreSQL Database URL and store in KeyVault
$outputs = $result.properties.outputs
$postgresDatabaseUrl = $($outputs.postgresDatabaseUrl.value)
$postgresDatabaseUrlName = "PostgresDatabaseUrl"
Write-Output "PostgresDatabaseUrl - $postgresDatabaseUrl"
az keyvault secret set --vault-name $kvName --name $postgresDatabaseUrlName --value """$postgresDatabaseUrl"""
Write-Output "################# FINISHED DEPLOYING SERVICE ##################"