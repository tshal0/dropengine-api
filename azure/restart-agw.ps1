
param ($service = 'dropengine', $location = 'eastus', $env = 'dev')

# Generate ResourceGroup, KeyVault resource names
$rgService = "rg-$service-$env"
$rgGateway = "rg-gateway"
$kvName = "kv-$service-$env"
$appName = "app-$service-$env"
$agwName = "agw-$service"
$vnetName = "vnet-$service"
$subnetName = "subnet-agw"


# Stop the Azure Application Gateway
az network application-gateway stop -n $agwName -g $rgGateway

# Start the Azure Application Gateway
az network application-gateway start -n $agwName -g $rgGateway