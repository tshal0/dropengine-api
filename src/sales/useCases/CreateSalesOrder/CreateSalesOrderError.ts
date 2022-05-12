/**
 * CSO ErrorTypes:
 * FailedToLoadVariant (conection failed, SKU or ID is invalid, etc)
 * InvalidLineItem (Personalization missing, invalid quantity, etc )
 * InvalidSalesOrder (Invalid AccountId/Name/Number/Date/LineItem(s)/Customer/ShippingAddress)
 * FailedToSaveSalesOrder (DbConnection failed)
 */
export enum CreateSalesOrderError {
  UnknownSalesError = "UnknownSalesError",
  SalesOrderValidationError = "SalesOrderValidationError",

  InvalidSalesOrder = "InvalidSalesOrder",
  InvalidLineItem = "InvalidLineItem",
  MissingLineItem = "MissingLineItem",
  FailedToSaveSalesOrder = "FailedToSaveSalesOrder",
  UserNotAuthorizedForAccount = "UserNotAuthorizedForAccount",
  AccountNotFound = "AccountNotFound",
  FailedToLoadVariantBySku = "FailedToLoadVariantBySku",
  FailedToLoadVariantById = "FailedToLoadVariantById"
}
