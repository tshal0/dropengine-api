# RFC: Azure Solution: Azure SA, AppGateway, SSL Certificate

**Author:** Thomas Shallenberger

**Date:** 01/28/2022

## Summary

I'm hosting a SPA as a static site on an Azure Storage Account, and want to put it behind an App Gateway so we can also host
an AppService at the same domain. The site must have an SSL cert.

## Design

## Static Site + App Gateway

https://sadropenginedev.z13.web.core.windows.net/

sadropenginedev.z13.web.core.windows.net

### Public Static IP

az network public-ip create --name pip-agw-dropengine -g rg-gateway --allocation-method Static --sku Standard

### VNet, Subnet

az network vnet create --name vnet-dropengine --resource-group rg-gateway --subnet-name subnet-agw

### Process

1. VNet online in rg
2. Storage Account Online, with SPA deployed
   1. An SA was deployed via template and enabled to serve static sites.
   2. The SA was configured to only allow connections from the VNet.
3. Public Static IP online.
4. Purchase SSL certificate and add to Azure
   1. Purchase SSL certificate from Namecheap
   2. Import into Azure Keyvault
      1. Create kv-dropengine-shared in rg-shared
      2. Certificates > Generate/Import > Generate
         1. Name: sslcert-dropengine
         2. CN=drop-engine.com
         3. PEM
      3. Create Certificate
      4. Download CSR
      5. Validate SSL cert in Namecheap using CSR
         1. Validate by email (admin@domain.com)
         2. Validate by CN
      6. Namecheap sends you an email with the SSL cert (CRT)
         1. Download CRT
      7. Merge
         1. Upload CRT downloaded from Namecheap email
5. Build the App Gateway
   1. Article used: <https://charbelnemnom.com/how-to-configure-application-gateway-in-front-of-azure-blob-storage/>
   2. Steps
      1. Configure DNS (GoDaddy for drop-engine.com) with an A record that points at Public Static IP
      2. Configure SA to only allow access from VNet Subnet, and my client IP
      3. Create/Configure App Gateway
         1. Need SSL cert (PFX) from Keyvault?
            1. Also need Managed Identity for the KV the SSL resides in
         2. Backend Pools
         3. Listeners
         4. HTTP Settings
         5. Custom Health Probe
         6. Routing Rules
         7. Backend Health

Get-AzApplicationGatewayBackendHealth -Name "agw-v2-dropengine-dev" -ResourceGroupName "rg-dropengine-dev"

# Stop the Azure Application Gateway
az network application-gateway stop -n agw-v2-dropengine-dev -g rg-dropengine-dev

# Start the Azure Application Gateway
az network application-gateway start -n agw-v2-dropengine-dev -g rg-dropengine-dev