@description('The name of the resource group holding the Azure Container Registry for this deployment')
param rgContainers string
@description('The name of the Azure Container Registry for this deployment')
param acrName string

@description('The name of the service (must be between 3-8 letters)')
param service string
@description('The environment for the service')
param env string = 'dev'

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

@description('The domain for the Auth0 integration')
@secure()
param Auth0Domain string
@description('The user account for the Auth0 integration')
@secure()
param Auth0User string
@description('The password for the Auth0 integration')
@secure()
param Auth0Password string
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
@description('The connection string for the MongoDB integration')
@secure()
param MongoConnectionString string
@description('The server host url for the MyEasyMonogram database')
@secure()
param LucentEndpoint string
@description('The db name for the MyEasyMonogram database')
@secure()
param LucentDatabase string
@description('The username for the MyEasyMonogram database')
@secure()
param LucentUsername string
@description('The password for the MyEasyMonogram database')
@secure()
param LucentPassword string
// Fetch the ACR for the Docker containers
resource azureContainerRegistry 'Microsoft.ContainerRegistry/registries@2017-10-01' existing = {
  name: acrName
  scope: resourceGroup(rgContainers)
}

resource userAssignedIdentities 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' existing = {
  name: 'id-acr-${env}'
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
  tags: {
  }
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
    type:'UserAssigned'
    userAssignedIdentities: {
      '/subscriptions/${subscription().subscriptionId}/resourcegroups/${rgContainers}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-acr-dev': {}
    }
  }
  properties: {
    enabled:true
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
          name: 'AZURE_STORAGE_ACCOUNT'
          value: saName
        }
        {
          name: 'AZURE_STORAGE_SAS_KEY'
          value: saAcctSasKey
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
          name: 'AUTH0_USER'
          value: Auth0User
        }
        {
          name: 'AUTH0_PASSWORD'
          value: Auth0Password
        }
        {
          name: 'LAUNCH_DARKLY_KEY'
          value: LaunchDarklyKey
        }
        {
          name: 'MONGO_CONNECTION_STRING'
          value: MongoConnectionString
        }
        {
          name: 'SERVICE_IMAGE'
          value: serviceImage
        }
        {
          name: 'LUCENT_ENDPOINT'
          value: LucentEndpoint
        }
        {
          name: 'LUCENT_DATABASE'
          value: LucentDatabase
        }
        {
          name: 'LUCENT_USERNAME'
          value: LucentUsername
        }
        {
          name: 'LUCENT_PASSWORD'
          value: LucentPassword
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
    type:'UserAssigned'
    userAssignedIdentities: {
      '/subscriptions/${subscription().subscriptionId}/resourcegroups/${rgContainers}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-acr-dev': {}
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
          name: 'AUTH0_USER'
          value: Auth0User
        }
        {
          name: 'AUTH0_PASSWORD'
          value: Auth0Password
        }
        {
          name: 'LAUNCH_DARKLY_KEY'
          value: LaunchDarklyKey
        }
        {
          name: 'MONGO_CONNECTION_STRING'
          value: MongoConnectionString
        }
        {
          name: 'SERVICE_IMAGE'
          value: serviceImage
        }
        {
          name: 'LUCENT_ENDPOINT'
          value: LucentEndpoint
        }
        {
          name: 'LUCENT_DATABASE'
          value: LucentDatabase
        }
        {
          name: 'LUCENT_USERNAME'
          value: LucentUsername
        }
        {
          name: 'LUCENT_PASSWORD'
          value: LucentPassword
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

resource dropengine_slot1_dropengine_slot1_azurewebsites_net 'Microsoft.Web/sites/slots/hostNameBindings@2021-02-01' = {
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
