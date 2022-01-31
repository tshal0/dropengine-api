
@description('The name of the service (must be between 3-8 letters)')
param service string
@description('The environment for the service')
param env string = 'staging'

@description('Name of the PostgreSQL Server')
param psqlName string = 'psql-${service}-${env}'
@description('The admin of the PostgreSQL Server')
@secure()
param psqlLogin string 
@description('The admins password for the PostgreSQL Server')
@secure()
param psqlPassword string

@description('Location for all resources.')
param location string = resourceGroup().location

resource psqlServer 'Microsoft.DBforPostgreSQL/servers@2017-12-01' = {
  name: psqlName
  location: location
  sku: {
    name: 'B_Gen5_2'
    tier: 'Basic'
    family: 'Gen5'
    capacity: 2
  }
  properties: {
    createMode: 'Default'
    administratorLogin: psqlLogin
    administratorLoginPassword: psqlPassword
    storageProfile: {
      storageMB: 51200
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
      storageAutogrow: 'Enabled'
    }
    version: '11'
    sslEnforcement: 'Enabled'
    minimalTlsVersion: 'TLSEnforcementDisabled'
    infrastructureEncryption: 'Disabled'
    publicNetworkAccess: 'Enabled'
  }
}
resource allowAllWindowsAzureIps 'Microsoft.DBforPostgreSQL/servers/firewallRules@2017-12-01' = {
  name: '${psqlName}/AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
  dependsOn: [
    psqlServer
  ]
}

resource clientIpAddress 'Microsoft.DBforPostgreSQL/servers/firewallRules@2017-12-01' = {
  name: '${psqlName}/ClientIPAddress_2021-8-17_14-21-41'
  properties: {
    startIpAddress: '75.76.53.221'
    endIpAddress: '75.76.53.221'
  }
  dependsOn: [
    psqlServer
  ]
}
resource db 'Microsoft.DBforPostgreSQL/servers/databases@2017-12-01' = {
  parent: psqlServer
  name: service
  properties: {
    charset: 'UTF8'
    collation: 'English_United States.1252'
  }
}

var user = '${psqlLogin}@${psqlName}'
var password = psqlPassword
var host = psqlServer.properties.fullyQualifiedDomainName
var port = '5432'
var schema = 'public'
var database_url = 'postgresql://${user}:${password}@${host}:${port}/${db.name}?schema=${schema}&sslmode=prefer'

// We output the database_url in order to store it in a KeyVault for use in migrations later
output database_url string = database_url

