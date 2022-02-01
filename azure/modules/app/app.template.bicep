@description('The name of the resource group holding the Azure Container Registry for this deployment')
param rgContainers string
@description('The name of the Azure Container Registry for this deployment')
param acrName string

@description('The name of the service (must be between 3-8 letters)')
param service string
@description('The environment for the service')
param env string

@description('Location for all resources.')
param location string = resourceGroup().location

param startupCommand string = ''

@description('The name of the Docker image to be linked to the app service (website)')
@secure()
param serviceImage string

// @description('The PostgreSQL Database Server URL')
// param psqlServerDatabaseUrl string

@description('Storage Account connection string')
param saConnString string
@description('Storage Account Account SAS Key')
param saAcctSasKey string
@description('Storage Account name')
param saName string

@description('Shopify API Key')
@secure()
param ShopifyApiKey string
@description('The Shopify API Secret')
@secure()
param ShopifyApiSecret string
@description('The Shopify API Scopes requested when generating access tokens')
@secure()
param ShopifyApiScopes string

@description('The Machine to Machine client ID for the Auth0 integration')
@secure()
param Auth0M2MClientId string
@description('The Machine to Machine client secret for the Auth0 integration')
@secure()
param Auth0M2MClientSecret string

@description('The domain for the Auth0 integration')
@secure()
param Auth0Domain string
@description('The audience identifier for the Auth0 integration')
@secure()
param Auth0Audience string
@description('The client ID for the Auth0 integration')
@secure()
param Auth0ClientId string
@description('The client secret for the Auth0 integration')
@secure()
param Auth0ClientSecret string
@description('The LaunchDarkly SDK key for the LaunchDarkly feature toggle integration')
@secure()
param LaunchDarklyKey string

@description('PostgreSQL Database Url')
@secure()
param PostgresDatabaseUrl string

// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0AccessTokenUrl string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0MgmtClientId string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0MgmtClientSecret string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0MgmtAudience string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0MgmtGrantType string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0MgmtApiUrl string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0ResourceServerIdentifier string

// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0ResourceServerId string
// @description('The client secret for the Auth0 integration')
// @secure()
// param Auth0BasicConnection string

resource userAssignedIdentities 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: 'id-acr-${env}'
  location: location
}

// Fetch the ACR for the Docker containers
resource azureContainerRegistry 'Microsoft.ContainerRegistry/registries@2017-10-01' existing = {
  name: acrName
  scope: resourceGroup(rgContainers)
}

// Provision the App Service Plan
var serverFarmName = 'plan-${service}-${env}'
resource serverFarm 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: serverFarmName
  location: location
  kind: 'linux'
  sku: {
    name: 'P1V2'
  }
  properties: {
    reserved: true
  }
}

var appinsName = 'appi-${service}-${env}'
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appinsName
  kind: 'web'
  location: location
  tags: {}
  properties: {
    Application_Type: 'web'
  }
}

// Provision the App Service (set up to run Docker containers)
var appName = 'app-${service}-${env}'
var slot1 = '${appName}-slot1'
resource app 'Microsoft.Web/sites@2020-12-01' = {
  name: appName
  location: location
  kind: 'app,linux,container'
  tags: {
    'hidden-related:/subscriptions/${subscription().subscriptionId}/resourcegroups/${resourceGroup().name}/providers/Microsoft.Web/serverfarms/${serverFarmName}': 'empty'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '/subscriptions/${subscription().subscriptionId}/resourcegroups/${resourceGroup().name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-acr-${env}': {}
    }
  }
  properties: {
    enabled: true
    siteConfig: {
      alwaysOn: true
      httpLoggingEnabled: true
      acrUseManagedIdentityCreds: false
      appCommandLine: startupCommand
      linuxFxVersion: 'DOCKER|${azureContainerRegistry.properties.loginServer}/${serviceImage}'
      appSettings: [
        // {
        //   name: 'DATABASE_URL'
        //   value: psqlServerDatabaseUrl
        // }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: azureContainerRegistry.properties.loginServer
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: listCredentials(azureContainerRegistry.id, '2019-05-01').username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: listCredentials(azureContainerRegistry.id, '2019-05-01').passwords[0].value
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'AZURE_STORAGE_CONNECTIONSTRING'
          value: saConnString
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT_NAME'
          value: saName
        }
        {
          name: 'AZURE_STORAGE_SAS_KEY'
          value: saAcctSasKey
        }
        {
          name: 'SHOPIFY_API_KEY'
          value: ShopifyApiKey
        }
        {
          name: 'SHOPIFY_API_SECRET'
          value: ShopifyApiSecret
        }
        {
          name: 'SHOPIFY_API_SCOPES'
          value: ShopifyApiScopes
        }
        {
          name: 'AUTH0_DOMAIN'
          value: Auth0Domain
        }
        {
          name: 'AUTH0_AUDIENCE'
          value: Auth0Audience
        }
        {
          name: 'AUTH0_CLIENT_ID'
          value: Auth0ClientId
        }
        {
          name: 'AUTH0_CLIENT_SECRET'
          value: Auth0ClientSecret
        }
        {
          name: 'AUTH0_M2M_CLIENT_ID'
          value: Auth0M2MClientId
        }
        {
          name: 'AUTH0_MEM_CLIENT_SECRET'
          value: Auth0M2MClientSecret
        }
        {
          name: 'LAUNCH_DARKLY_KEY'
          value: LaunchDarklyKey
        }
        {
          name: 'SERVICE_IMAGE'
          value: serviceImage
        }
        {
          name: 'DATABASE_URL'
          value: PostgresDatabaseUrl
        }
        {
          name: 'PORT'
          value: '8800'
        }
        {
          name: 'WEBSITES_PORT'
          value: '8800'
        }
      ]
    }
    serverFarmId: serverFarm.id
    reserved: true
    isXenon: false
    hyperV: false
    httpsOnly: true
  }
  dependsOn: [
    serverFarm
    appInsights
  ]
}
resource appConfig 'Microsoft.Web/sites/config@2021-02-01' = {
  parent: app
  name: 'web'
  properties: {
    numberOfWorkers: 1
    defaultDocuments: [
      'Default.htm'
      'Default.html'
      'Default.asp'
      'index.htm'
      'index.html'
      'iisstart.htm'
      'default.aspx'
      'index.php'
      'hostingstart.html'
    ]
    netFrameworkVersion: 'v4.0'
    linuxFxVersion: 'DOCKER|${azureContainerRegistry.properties.loginServer}/${serviceImage}'
    requestTracingEnabled: false
    remoteDebuggingEnabled: false
    remoteDebuggingVersion: 'VS2019'
    httpLoggingEnabled: true
    acrUseManagedIdentityCreds: false
    logsDirectorySizeLimit: 35
    detailedErrorLoggingEnabled: false
    publishingUsername: '$${appName}'
    scmType: 'VSTSRM'
    use32BitWorkerProcess: true
    webSocketsEnabled: false
    alwaysOn: true
    managedPipelineMode: 'Integrated'
    virtualApplications: [
      {
        virtualPath: '/'
        physicalPath: 'site\\wwwroot'
        preloadEnabled: true
      }
    ]
    loadBalancing: 'LeastResponseTime'
    experiments: {
      rampUpRules: []
    }
    autoHealEnabled: false
    vnetRouteAllEnabled: false
    vnetPrivatePortsCount: 0
    localMySqlEnabled: false
    ipSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictionsUseMain: false
    http20Enabled: false
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.0'
    ftpsState: 'AllAllowed'
    preWarmedInstanceCount: 0
    functionAppScaleLimit: 0
    functionsRuntimeScaleMonitoringEnabled: false
    minimumElasticInstanceCount: 1
    azureStorageAccounts: {}
  }
}

resource appSlot1 'Microsoft.Web/sites/slots@2021-02-01' = {
  parent: app
  name: 'slot1'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '/subscriptions/${subscription().subscriptionId}/resourcegroups/${resourceGroup().name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-acr-${env}': {}
    }
  }
  kind: 'app,linux,container'
  properties: {
    enabled: true
    hostNameSslStates: [
      {
        name: '${slot1}.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Standard'
      }
      {
        name: '${slot1}.scm.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Repository'
      }
    ]
    serverFarmId: serverFarm.id
    reserved: true
    isXenon: false
    hyperV: false
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'DOCKER|${azureContainerRegistry.properties.loginServer}/${serviceImage}'
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      http20Enabled: false
      functionAppScaleLimit: 0
      minimumElasticInstanceCount: 1
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: azureContainerRegistry.properties.loginServer
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: listCredentials(azureContainerRegistry.id, '2019-05-01').username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: listCredentials(azureContainerRegistry.id, '2019-05-01').passwords[0].value
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'AZURE_STORAGE_CONNECTIONSTRING'
          value: saConnString
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT'
          value: saName
        }
        {
          name: 'AZURE_STORAGE_SAS_KEY'
          value: saAcctSasKey
        }
        {
          name: 'SHOPIFY_API_KEY'
          value: ShopifyApiKey
        }
        {
          name: 'SHOPIFY_API_SECRET'
          value: ShopifyApiSecret
        }
        {
          name: 'SHOPIFY_API_SCOPES'
          value: ShopifyApiScopes
        }
        {
          name: 'AUTH0_DOMAIN'
          value: Auth0Domain
        }
        {
          name: 'AUTH0_AUDIENCE'
          value: Auth0Audience
        }
        {
          name: 'AUTH0_CLIENT_ID'
          value: Auth0ClientId
        }
        {
          name: 'AUTH0_CLIENT_SECRET'
          value: Auth0ClientSecret
        }
        {
          name: 'AUTH0_M2M_CLIENT_ID'
          value: Auth0M2MClientId
        }
        {
          name: 'AUTH0_MEM_CLIENT_SECRET'
          value: Auth0M2MClientSecret
        }
        {
          name: 'LAUNCH_DARKLY_KEY'
          value: LaunchDarklyKey
        }
        {
          name: 'SERVICE_IMAGE'
          value: serviceImage
        }
        {
          name: 'DATABASE_URL'
          value: PostgresDatabaseUrl
        }
        {
          name: 'PORT'
          value: '8800'
        }
        {
          name: 'WEBSITES_PORT'
          value: '8800'
        }
      ]
    }
    scmSiteAlsoStopped: false
    clientAffinityEnabled: true
    clientCertEnabled: false
    clientCertMode: 'Required'
    hostNamesDisabled: false
    containerSize: 0
    dailyMemoryTimeQuota: 0
    httpsOnly: true
    redundancyMode: 'None'
    storageAccountRequired: false
    keyVaultReferenceIdentity: 'SystemAssigned'
  }
}

resource appSlot1Web 'Microsoft.Web/sites/slots/config@2021-02-01' = {
  parent: appSlot1
  name: 'web'
  properties: {
    numberOfWorkers: 1
    defaultDocuments: [
      'Default.htm'
      'Default.html'
      'Default.asp'
      'index.htm'
      'index.html'
      'iisstart.htm'
      'default.aspx'
      'index.php'
      'hostingstart.html'
    ]
    netFrameworkVersion: 'v4.0'
    linuxFxVersion: 'DOCKER|${azureContainerRegistry.properties.loginServer}/${serviceImage}'
    requestTracingEnabled: false
    remoteDebuggingEnabled: false
    remoteDebuggingVersion: 'VS2019'
    httpLoggingEnabled: true
    acrUseManagedIdentityCreds: false
    logsDirectorySizeLimit: 35
    detailedErrorLoggingEnabled: false
    publishingUsername: '$${appName}__slot1'
    scmType: 'None'
    use32BitWorkerProcess: true
    webSocketsEnabled: false
    alwaysOn: true
    managedPipelineMode: 'Integrated'
    virtualApplications: [
      {
        virtualPath: '/'
        physicalPath: 'site\\wwwroot'
        preloadEnabled: true
      }
    ]
    loadBalancing: 'LeastResponseTime'
    experiments: {
      rampUpRules: []
    }
    autoHealEnabled: false
    vnetRouteAllEnabled: false
    vnetPrivatePortsCount: 0
    localMySqlEnabled: false
    ipSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 1
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictionsUseMain: false
    http20Enabled: false
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.0'
    ftpsState: 'AllAllowed'
    preWarmedInstanceCount: 0
    functionAppScaleLimit: 0
    functionsRuntimeScaleMonitoringEnabled: false
    minimumElasticInstanceCount: 1
    azureStorageAccounts: {}
  }
  dependsOn: [
    appSlot1
  ]
}

resource orders_slot1_orders_slot1_azurewebsites_net 'Microsoft.Web/sites/slots/hostNameBindings@2021-02-01' = {
  parent: appSlot1
  name: '${slot1}.azurewebsites.net'
  properties: {
    siteName: '${appName}(slot1)'
    hostNameType: 'Verified'
  }
  dependsOn: [
    appSlot1
  ]
}
