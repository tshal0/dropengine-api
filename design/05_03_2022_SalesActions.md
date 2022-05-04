# RFC: Sales Actions

**Author:** Thomas Shallenberger

**Date:** 05/03/2022

## Summary

We need to perform the following SalesActions:

1. UpdatePersonalization
   1. orderId
   2. lineNumber
   3. lineItemId?
   4. personalization (lineItemProperties)
   5. Validate personalization before persisting, throw err if invalid
   6. Validate lineItem has no parts past design stage
2. UpdateShipping
   1. orderId
   2. address
3. UpdateCustomer
   1. orderId
   2. customer
4. Send
   1. orderId
   2. manufacturerId
   3. companyCode
5. Recall
   1. orderId
6. Cancel
   1. orderId
