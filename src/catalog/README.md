# RFC: Catalog Module: Products and their Functions

**Author:** Thomas Shallenberger

**Date:** 04/09/2022

## Summary

We want to provide the ability for merchants to browse a catalog of products, segmented by product type, and import variants to be sold in their stores.

## Domain Model

1. ProductType
   1. Id
   2. Name
   3. Image
   4. ProductionData
   5. Option1
      1. Name
      2. Values
         1. Name
         2. Value
         3. Enabled
   6. Option2
   7. Option3
   8. LivePreview
2. Product
   1. Id
   2. Sku
   3. Type
   4. PricingTier
   5. Tags
   6. Image
   7. Svg
   8. CustomOptions
      1. Name
      2. Label
      3. Placeholder
      4. Required
      5. Type
      6. MaxLength
      7. Pattern
      8. Options
3. Variant
   1. Id
   2. Sku
   3. Image
   4. Height
   5. Width
   6. Weight
   7. Option1
      1. Name
      2. Value
   8. Option2
   9. Option3
   10. ManufacturingCost
   11. ShippingCost

## Integration

### MyEasySuite

1. Try Load from MES
2. If Exists
   1. LoadProductType: MetalArt
   2. SyncProduct
      1. LoadProductBySku
      2. ApplyMESVariant
      3. Save
   3. SyncVariant
      1. LoadVariantBySku
      2. ApplyMESVariant
      3. Save

We want to pull in the MES Variant by Sku if it exists,
build a Product and Variant,
load the aggregates,
upsert,
return the Variant aggregate.

Variant Model:

1. Sku
2. PartFileName
3. Material
4. Thickness
5. RouteTemplateId
6. Title
7. Categories
8. Tags
9. VariantImage
10. Price
11. Option1, OptionValue1
12. Option2, OptionValue2
13. Option3, OptionValue3
14. ManufacturingCost
15. ShippingCost
16. SVGs
    1. URL
    2. Name
17. CustomizeText
    1. FieldLength
    2. FieldPattern
    3. FieldType
    4. IsRequired
    5. Label
    6. PatternMessage
    7. Placeholder
    8. OptionList
