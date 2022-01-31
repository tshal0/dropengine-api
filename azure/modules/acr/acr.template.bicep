@description('The name of the Azure Container Registry where the Docker images reside')
param acrName string
@description('Location of the Azure Container Registry (usually external to current resourceGroup)')
param acrLocation string = resourceGroup().location

resource registryResource 'Microsoft.ContainerRegistry/registries@2017-10-01' = {
  sku: {
    name: 'Standard'
  }
  name: acrName
  location: acrLocation
  properties: {
    adminUserEnabled: true
  }
}
