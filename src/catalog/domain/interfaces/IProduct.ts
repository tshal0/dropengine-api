import { IProductTypeProps, IProductVariantProps } from ".";
import { CustomOption, ICustomOptionProps } from "..";
import { ProductType } from "../aggregates/ProductType";
import { ProductVariant } from "../aggregates/ProductVariant";
import {
  ProductSKU,
  ProductTags,
  ProductImage,
  ProductSvg,
  PricingTier,
  ProductUUID,
  ProductTypeName,
} from "../valueObjects";
/**
 * Represents the raw JSON value of the Product.
 * As the interface for the Aggregate (Product), needs following methods:
 * - create/init
 * - fromDb
 * - fromImport
 * - props
 * - toUpsert?
 *
 * Domain Actions
 * - Import
 * - GenerateVariant
 * - RemoveVariant
 * - DisableVariant
 * - UpdateCustomization
 * - ChangeSvg
 * - ChangeImage
 * - Add/Remove Tag
 * - Add/Remove Category
 * - ChangeSku
 */

export interface IProduct {
  uuid: ProductUUID;
  sku: ProductSKU;

  type: ProductTypeName;

  pricingTier: PricingTier;

  tags: ProductTags;
  // categories: ProductCategories;

  image: ProductImage;
  svg?: ProductSvg;

  customOptions: CustomOption[];
  variants: ProductVariant[];
  productType: ProductType;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product: Raw properties, for testing and serialization
 */
export interface IProductProps {
  uuid: string;
  sku: string;

  type: string;

  pricingTier: string;

  tags: string[];
  // categories: string[];

  image?: string | undefined;
  svg?: string | undefined;

  customOptions: ICustomOptionProps[];
  variants?: IProductVariantProps[] | undefined;
  productType?: IProductTypeProps | undefined;
  createdAt: Date;
  updatedAt: Date;
}
