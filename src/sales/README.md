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
