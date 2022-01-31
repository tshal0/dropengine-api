// Provisions the PostgreSQL Service, Azure Storage Account, and App Service cloud resources

@description('The name of the service (must be between 3-8 letters)')
param service string
@description('The environment for the service')
param env string = 'dev'
@description('Location for all resources.')
param location string = resourceGroup().location
@description('ResourceGroup Name.')
param rgService string = resourceGroup().name
@description('The name of the KeyVault for this deployment')
param kvName string = 'kv-${service}-${env}'
@description('The name of the resource group holding the Azure Container Registry for this deployment')
param rgContainers string = 'rg-containers'
@description('The name of the Azure Container Registry for this deployment')
param acrName string = 'acrdropengine${env}'

var subscriptionId = subscription().subscriptionId

resource kv 'Microsoft.KeyVault/vaults@2019-09-01' existing = {
  name: kvName
  scope: resourceGroup(subscriptionId, rgService)
}

// Provision the PostgreSQL Database
module psqlServer 'modules/psql/psql.template.bicep' = {
  name: 'psqlServerDeploy'
  params: {
    service: service
    env: env
    psqlLogin: kv.getSecret('SqlAdminLogin')
    psqlPassword: kv.getSecret('SqlAdminLoginPassword')
  }
}

var postgresDatabaseUrl = psqlServer.outputs.database_url

// Provision the Storage Account for the service
module storageAccount 'modules/sa/sa.template.bicep' = {
  name: 'storageDeploy'
  params: {
    service: service
    env: env
    location: location
  }
}


// TODO: Deploy AppService

var saConnString = storageAccount.outputs.storageAccountConnectionString
var saAcctSasKey = storageAccount.outputs.storageAccountSasKey
var saName = storageAccount.outputs.saName

// Provision the service (including the AppService Plan, AppService, AppInsights)
module appService 'modules/app/app.template.bicep' = {
  name: 'appServiceDeployment'
  params: {
    service: service
    env: env
    acrName: acrName
    // psqlServerDatabaseUrl: psqlServerDatabaseUrl
    rgContainers: rgContainers
    saAcctSasKey: saAcctSasKey
    saConnString: saConnString
    saName: saName
    location:location
    serviceImage: kv.getSecret('ServiceImage')

    ShopifyApiKey: kv.getSecret('ShopifyApiKey')
    ShopifyApiSecret: kv.getSecret('ShopifyApiSecret')
    ShopifyApiScopes: kv.getSecret('ShopifyApiScopes')
    Auth0Audience: kv.getSecret('Auth0Audience')
    Auth0ClientId: kv.getSecret('Auth0ClientId')
    Auth0ClientSecret:kv.getSecret('Auth0ClientSecret')
    Auth0Domain:kv.getSecret('Auth0Domain')
    LaunchDarklyKey:kv.getSecret('LaunchDarklyKey')
    PostgresDatabaseUrl:postgresDatabaseUrl    
    Auth0M2MClientId:kv.getSecret('Auth0M2MClientId')
    Auth0M2MClientSecret:kv.getSecret('Auth0M2MClientSecret')
  }
}

// Output the PostgreSQL database URL (will be sent to the KeyVault)
output postgresDatabaseUrl string = postgresDatabaseUrl
output saConnString string = saConnString
output saAcctSasKey string = saAcctSasKey
output saName string = saName
