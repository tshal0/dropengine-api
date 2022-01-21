# RFC: Connect Shopify Store

**Author:** Thomas Shallenberger

**Date:** 12/22/2021

## Summary

We need to provide the ability for merchants to sign up and connect their Shopify stores.

## Design

1. Pre-reqs
   1. Shopify App
      1. API_KEY
      2. API_SECRET
      3. Handler URL
      4. Callback URL
   2. Handler
      1. QUERY: shop, timestamp, hmac
      2. TODO:
         1. Validate Install Request
         2. Check if Shop Exists Already
         3. If Not Exists, Begin Installation Process
         4. Generate Installation Permissions Prompt
         5. Redirect User to Permissions
   3. Callback
      1. QUERY: code, hmac, timestamp, host, state, shop, host
      2. TODO:
         1. Confirm Installation
         2. Request Permanent Access Token
         3. Persist Access Token in User Account Connection (Type: Shopify)

### Domain Model

ShopifyAccount

Props

1. id
2. userId
3. shopOrigin
4. accessToken
5. createdAt
6. updatedAt
7. status
   1. Pending Installation
      1. Awaiting installation
   2. Active
      1. Installation completed, access token is valid, we are actively fetching and pushing to this store
   3. Disabled
      1. Installed, and we are processing orders in, but not fulfilling due to lack of payment.
   4. Deactivated
      1. Either User was deleted, or the user uninstalled it from their store.
         1. All PII should be deleted per GDPR requirements.
8. installs
   1. shop
   2. hmac
   3. nonce
   4. timestamp
   5. scopes
   6. installLink
   7. accessTokenLink
   8. installationStatus
      1. Initiated
      2. AwaitingConfirmation
      3. AwaitingValidation
      4. AwaitingAccessToken
      5. Complete
      6. ScopesMissing
      7. ShopOriginInvalid
      8. Failed
      9. Uninstalled
9. uninstalls
   1. initiatedAt
   2. completedAt
   3. status
      1. Initiated
      2. PendingWebhookRemoval
      3. PendingProductRemoval
      4. PendingAccountDeactivation
      5. PendingDataRemoval (access token, PII, etc)
      6. Completed

If an installation is initialized, it must be on a ShopifyAccount that is PendingInstallation or Deactivated?
A shopify account that is Active or Disabled cannot have a new Installation created. INVARIANT
A ShopifyAccount with an Installation that Failed may restart the Installation process?
Therefore an Account may have multiple Installations, ending with a successful installation?
A successful Installation means there needs to be an Uninstallation process.
Uninstallation would just mean we deactivate the ShopifyAccount, and mark the installation as reverted?
Do we care about multiple installation attempts? Do we care about multiple installations and uninstallations?
If a merchant initiates an installation and fails at some point, we can record this for troubleshooting?
Uninstall rates?

On uninstallation, we keep the products and all that info. We simply deactivate the Shopify Account linked, remove the access token. No need for uninstall entity.

Events

InstallationInitiated
InstallationFailed
InstallationReset
ShopOriginValidated
HmacValidated
InstallPermissionsPromptLinkGenerated
InstallPermissionsPromptOpened
InstallPermissionsPromptAccepted
InstallationConfirmed
TokenRequestLinkGenerated
TokenRequested
InstallationSucceeded
ShopifyAccountActivated
ShopifyAccountDeactivated
ShopifyAccountFrozen
ShopifyAccountDisabled
ShopifyAccountSetupIncomplete
ShopifyAccountScopesMissing
ShopifyAccountShopOriginInvalid

Lifecycle

1. Account Initialized
2. Account Validated
3. Installation Prompt Link Generated
4. User Redirected to Installation Prompt
5. Installation Accepted
6. Installation Confirmed
7. Access Token Link Generated
8. Access Token Requested
9. Access Token Received
10. Installation Complete
