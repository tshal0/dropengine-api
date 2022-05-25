# RFC: Sales Module: Orders and their Functions

**Author:** Thomas Shallenberger

**Date:** 04/06/2022

## Summary

We want to provide the ability for merchants to place orders in our system, allowing us to process and fulfill these orders.

## Domain Model

1. Order
   1. LineItems
      1. LineNumber
      2. Quantity
      3. Variant
      4. Personalization
      5. Parts
   2. Customer
   3. ShippingAddress
   4. ShippingDetails
      1. ShippingAddress
      2. ShipstationOrderId
      3. ShipstationOrderKey
      4. TrackingNumbers
   5. ManufacturingDetails
      1. ManufacturingOrderId
   6. BillingAddress
   7. Shipments
   8. Status
   9. Flags
   10. Events

## Commands

1. PlaceOrder
2. ChangePersonalization
3. ChangeShippingAddress
4. ChangeCustomerEmail
5. HandleShipstationEvent
6. HandleManufacturingEvent
7. AddShipment
8. FlagOrder
9. CompleteOrder
10. AddTrackingNumber
11. SendToManufacturer
12. Recall
13. GenerateLineItemPart

## Structure

1. Features
   1. PlaceOrder
   2. ChangeCustomerInfo
   3. ChangePersonalization
   4. ChangeShippingAddress
   5. HandleMyEasySuiteOrder
2. Services
   1. SalesService (handling CRUD operations), findById, query, delete, loadEvents
3. API
   1. Controllers
   2. DTO
   3. Middleware (pipes, validators)
   4. Exceptions (formatted for the Response to the Client)
4. Domain
   1. Events
   2. Model
      1. SalesOrder
         1. Id
         2. Number
         3. Name
         4. Status
         5. UpdatedAt
         6. CreatedAt
      2. SalesLineItem
      3. SalesCustomer
      4. SalesVariant
      5. Personalization
5. Database
   1. Mongo
      1. repositories
         1. DomainEventRepository
         2. OrdersRepository
      2. schemas
         1. Address
         2. Customer
         3. Dimension
         4. DomainEvent
         5. LineItemProperty
         6. Money
         7. PersonalizationRule
         8. ProductionData
         9. SalesLineItem
         10. SalesOrder
         11. SalesVariant
         12. SalesVariantOption
         13. Weight
   2. SalesOrderRepository

## Order Creation Process

1. Validate OrderNumber
2. Generate OrderName
3. Validate Customer
4. Validate ShippingAddress
5. Validate BillingAddress
6. Validate LineItems
   1. Generate LineItem LineNumber
   2. Validate LineItemQuantity
   3. Validate LineItemSKU OR LineItemVariantID Exists
      1. If NOT EXISTS, throw OrderValidationError: Variant Does Not Exist with SKU/ID.
   4. LoadLineItemVariant (By SKU/ID)
      1. ProductVariant
         1. ProductVariantId
         2. ProductVariantSKU
         3. ProductVariantOption1, 2, 3
      2. Product
         1. PersonalizationRules (CustomOptions)
      3. ProductType
         1. ProductionData
   5. Extract Product Variant Personalization Rules
   6. Extract LineItem Personalization (LineItemProperties)
   7. Validate LineItemProperties against PersonalizationRules
   8. Generate LineItemParts
      1. Id
      2. ImportDate
      3. OriginalPartName
      4. Iteration
      5. PartName
      6. ImageUrl
      7. GeoPath
      8. OrderId
      9. Options
      10. Stage
      11. Nest
      12. Workstation
      13. Material
      14. Thickness
      15. Route
      16. Color
      17. Size
7. Validate User Authorization

## GraphQL

We are adding a GraphQL endpoint for querying SalesModule, specifically for SalesOrders.

Goals:

1. QueryOrder
   1. By ID, Name
2. QueryOrders
   1. Project
   2. Id, Name, Number, Date, Status, TotalQuantity, Merchant, Seller, Manufacturer, Colors, Sizes
   3. Within Date Range
   4. By Manufacturer
   5. By Merchant
   6. By Seller/Account
   7. Contains Sizes
   8. Contains Colors
   9. SortBy
      1. OrderDate
      2. OrderName
      3. TotalQuantity
      4. Status

## ~~Results vs Exceptions~~ **Deprecated**

~~We typically use Results only for ValueObjects in order to aggregate the validation errors before throwing an exception.~~

~~Aggregates throw ValidationExceptions.~~

~~UseCases, Controllers use Exceptions.~~
