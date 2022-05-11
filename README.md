# DropEngine

## System Design

1. Auth (Users/Accounts/Members/Stores)
   1. Outsources User generation, authentication, authorization to Auth0
   2. Responsible for Accounts, Members, Stores
2. Catalog (ProductTypes/Products/ProductVariants)
   1. Responsible for Products/Variants import, managing ProductTypes, Products, Variants
   2. Exposes API for Sales to load a projection of a Variant including its ProductType/Product metatdata
3. Sales (SalesOrders/SalesLineItems/SalesVariants)
   1. Responsible for managing lifecycle of SalesOrders and their LineItems
   2. Exposes API for clients to place orders, cancel orders, query orders, and perform general maintenance
4. Manufacturing (Manufacturers/Stages/Routes/Workstations/Machines/ManufacturingOrders/Parts/ProductionOrders/Jobs/ScrapTemplates)
   1. Responsible for managing lifecycle of Manufacturer accounts, ManufacturingOrders and their Parts
   2. Allows manufacturers to set up Stages, Routes, Workstations, for managing the production of their Parts
   3. Allows Sales API to push line items to manufacturers in the form of a ManufacturingOrder
5. Shipping (Shipments)
   1. Responsible for managing lifecycle of Shipments
   2. Integrates with Shipping provider (ShipEngine/Shipstation) to handle webhooks when items are shipped
6. Billing (Invoices/PaymentMethods/Payments)
   1. Responsible for managing PaymentMethods
   2. Responsible for generating Invoices
   3. Responsible for recording Payments made by merchant/manufacturer accounts, tying them to SalesOrders/ManufacturingOrders/Parts.
7. Pricing

## Tips

Use dpdm to detect circular deps.

## Stoplight

stoplight push --ci-token {{ci-token}} --url https://dropengine.stoplight.io
