# RFC: Upgrade LineItems to Aggregates

**Author:** Thomas Shallenberger

**Date:** 05/04/2022

## Summary

Up until now, we've considered LineItems as child components of Orders, to be updated solely from
the context of its parent SalesOrder.

We've discovered the need to consider operations on LineItems independent of the SalesOrder.

Ex., Send to manufacturer, recall, change personalization, generate production files, change variant, change quantity.

We must begin treating LineItems as Aggregates, with their own collection.

## Design

1. Add LineItems collection, repository, model, schema changes, controller.
2. Add SalesLineItem create, load, save functionality
3. Modify SalesOrder create functionality to
   1. Create the SalesOrder
   2. Create the LineItems
   3. Add the LineItems to the SalesOrder
      1. Add the LineItemID to SalesOrder.lineItems
      2. Update LineItem.orderId
      3. Save LineItem
   4. Save the SalesOrder
4. Modify SalesOrder load functionality to
   1. Populate lineItems
   2. Load lineItems into SalesOrder
5. Modify SalesOrder update (save) functionality to
   1. Convert lineItems from objects to their identifiers
6. Add Mongo migration converting existing SalesOrders
   1. Copy existing LineItems into new collection
   2. Update SalesOrder with LineItem identifiers
