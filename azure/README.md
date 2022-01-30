# Azure Resource Deployments

- Service Name: dropengine
- Environments: dev, prod
- Auth0 Tenants: drop-engine-dev, drop-engine-prod
- Resources Needed
  - ResourceGroup
    - rg-dropengine-dev, rg-dropengine-prod
  - KeyVault
    - kv-dropengine-dev, kv-dropengine-prod
  - Storage Account
    - sadropenginedev001, sadropengineprod001
  - PostgreSQL
    - psql-dropengine-dev, psql-dropengine-prod
  - AppService
    - app-dropengine-dev, app-dropengine-prod
  - AppInsights
    - appi-dropengine-dev, appi-dropengine-prod

## ARM Deployments

_Note: This deployment strategy has been modified from the original Dockerized strategy involving Azure Container Registries._

Initial Setup:

1. Init Dev
   1. Init rg, kv, sa, psql, app, appi
2. Init Prod

   1. Init rg, kv, sa, psql, app, appi

3. Deploy resource groups
   1. init resource group for service
4. Deploy keyvault
   1. kv.template
5. Deploy service resources
   1. service.template
   2. service.template.parameters 2. service 3. env 4. iteration
   3. Parameters: 2. service 3. env 6. sqlLogin 7. sqlLoginPassword 8. KeyVault secrets
6. Set DatabaseUrl secret

## Scripts

### Deploy Service Environment

Deploys all resources to the environment specified

```ps1
.\bicep\scripts\dev\deploy-service.dev.ps1 -service dropengine
```

```ps1
.\bicep\scripts\prod\deploy-service.prod.ps1 -service dropengine
```

### Init KeyVault

Ensures resource groups are initialized and deploys KeyVault

```ps1
.\bicep\scripts\init-keyvault.dev.ps1
```

### Deploy Service

Ensures resource groups are initialized and deploys Azure Container Registry

```ps1
.\bicep\scripts\deploy-service.dev.ps1
```
