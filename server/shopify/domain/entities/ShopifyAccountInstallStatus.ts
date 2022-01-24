export abstract class ShopifyAccountInstallStatus {
  static readonly PENDING: string = `PENDING`;
  static readonly PENDING_SHOPIFY_ACCEPT: string = `PENDING_SHOPIFY_ACCEPT`;
  static readonly ACCEPTED: string = `PENDING_ACCESS_TOKEN`;
  static readonly COMPLETE: string = `COMPLETE`;
  static readonly FAILED: string = `FAILED`;
}

export abstract class ShopifyAccountInstallFailedReason {
  static readonly NONE: string = `NONE`;
  static readonly INSTALL_LINK_EXPIRED: string = `INSTALL_LINK_EXPIRED`;
  static readonly SHOP_ORIGIN_INVALID: string = `SHOP_ORIGIN_INVALID`;
  static readonly HMAC_INVALID: string = `HMAC_INVALID`;
  static readonly TIMESTAMP_INVALID: string = `TIMESTAMP_INVALID`;
  static readonly NONCE_INVALID: string = `NONCE_INVALID`;
  static readonly USER_INVALID: string = `USER_INVALID`;
  static readonly SCOPES_INVALID: string = `SCOPES_INVALID`;
  static readonly SCOPES_MISSING: string = `SCOPES_MISSING`;
}
