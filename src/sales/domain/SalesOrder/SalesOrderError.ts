/**
 * Aggregates need: events, domain methods, initializers, converters
 */

export enum SalesOrderError {
  InvalidSalesOrder = "InvalidSalesOrder",
  InvalidSalesOrderProperty = "InvalidSalesOrderProperty",
  FailedToCreateLineItems = "FailedToCreateLineItems",
  FailedToLoadLineItems = "FailedToLoadLineItems",
  InvalidShippingAddress = "InvalidShippingAddress"
}
