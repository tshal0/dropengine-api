import { Result, ResultError, UUID } from "@shared/domain";
import { ProductEvent } from "../events";

import moment from "moment";

import { IProduct, IProductProps } from "../interfaces";
import {
  InvalidCustomOptions,
  InvalidProductVariants,
} from "../errors/ProductErrors";
import { IAggregate } from "@shared/domain/IAggregate";
import { ProductVariant } from "./ProductVariant";
import { CustomOption } from "../valueObjects/CustomOption/CustomOption";
import { DbProduct } from "../entities/Product.entity";
import { cloneDeep, toLower } from "lodash";
import {
  ProductImage,
  PricingTier,
  ProductSKU,
  ProductSvg,
  ProductTags,
  ProductUUID,
  ProductNID,
  ProductTypeName,
} from "../valueObjects";
import { ProductType } from "./ProductType";
import {
  CreateProductDto,
  CustomOptionDto,
} from "@catalog/dto/Product/CreateProductDto";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";
/**
 * Aggregates need: events, domain methods, initializers, converters
 */
export enum ProductError {
  InvalidProduct = "InvalidProduct",
}
export class InvalidProduct implements ResultError {
  public stack: string;
  public name = ProductError.InvalidProduct;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: any,
    public reason: string
  ) {
    this.message = `${this.name} '${value.sku}': ${reason}`;
  }
}

export class Product extends IAggregate<IProductProps, IProduct, DbProduct> {
  protected _events: ProductEvent[];
  private constructor(props: IProduct, entity: DbProduct) {
    super(props, entity);
  }
  public get id(): ProductUUID {
    return this._value.id;
  }

  public get sku(): ProductSKU {
    return this._value.sku;
  }

  public get type(): ProductTypeName {
    return this._value.type;
  }

  /**
   * Get the value object of the Product
   * @returns Product
   */
  public value(): IProduct {
    const props: IProduct = cloneDeep(this._value);
    return Object.seal(props);
  }

  /**
   * Returns the database entity.
   * @returns {IProductProps}
   */
  public entity(): DbProduct {
    const value: DbProduct = this._entity;

    return Object.seal(value);
  }
  /**
   * Returns the raw props.
   * @returns {IProductProps}
   */
  public props(maxDepth?: number | undefined): IProductProps {
    const value: DbProduct = this._entity;

    return Object.seal(value.props(maxDepth));
  }
  /** Domain Actions */

  public update(dto: CreateProductDto): Result<Product> {
    // Validate DTO
    let results = {
      customOptions: Product.createCustomOptions(dto.customOptions),
      pricingTier: PricingTier.from(dto.pricingTier),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProduct(
          errors,
          { ...dto },
          `Failed to create Product. See inner error for details.`
        )
      );
    }
    let valueObjects = {
      sku: ProductSKU.from(dto.sku),
      image: ProductImage.from(dto.image).value(),
      svg: ProductSvg.from(dto.svg),
      tags: ProductTags.from(dto.tags),
    };

    this.setSku(valueObjects.sku);
    this.setImage(valueObjects.image);
    this.setSvg(valueObjects.svg);
    this.setTags(valueObjects.tags);
    this.setPricingTier(results.pricingTier.value());
    this.setCustomOptions(results.customOptions.value());

    return Result.ok(this);
  }
  public setProductType(value: ProductType) {
    this._value.productType = value;
    this._entity.productType = value.entity();
    return this;
  }
  public setSku(value: ProductSKU) {
    this._value.sku = value;
    this._entity.sku = value.value();
    return this;
  }
  public setType(value: ProductTypeName) {
    this._value.type = value;
    this._entity.type = value.value();
    return this;
  }
  public setPricingTier(value: PricingTier) {
    this._value.pricingTier = value;
    this._entity.pricingTier = value.value();
    return this;
  }
  public setTags(value: ProductTags) {
    this._value.tags = value;
    this._entity.tags = value.value();
    return this;
  }
  public setImage(value: ProductImage) {
    this._value.image = value;
    this._entity.image = value.value();
    return this;
  }
  public setSvg(value: ProductSvg) {
    this._value.svg = value;
    this._entity.svg = value.value();
    return this;
  }
  public setCustomOptions(value: CustomOption[]) {
    this._value.customOptions = value;
    this._entity.customOptions = value.map((v) => v.props());
    return this;
  }
  public raiseEvent(event: ProductEvent): Product {
    this._events.push(event);
    return this;
  }
  //TODO: Given ProductVariant, either Add (create), or Update

  public importVariant(dto: CreateProductVariantDto): Result<ProductVariant> {
    let pv = this._value.variants.find(
      (v) => v.sku == dto.sku || v.id == dto.id
    );
    if (pv) {
      return pv.update(dto);
    } else {
      return this.addVariant(dto);
    }
  }

  public addVariant(dto: CreateProductVariantDto): Result<ProductVariant> {
    const productTypeOption1 = this._entity.productType.option1?.name;
    const productTypeOption2 = this._entity.productType.option2?.name;
    const productTypeOption3 = this._entity.productType.option3?.name;

    const dtoOptions = [dto.option1, dto.option2, dto.option3].reduce(
      (map, n) => ((map[toLower(n.name)] = n.option), map),
      {} as { [key: string]: string }
    );
    const optionNames = [
      productTypeOption1,
      productTypeOption2,
      productTypeOption3,
    ];
    const optionMap = optionNames.reduce(
      (map, n) => ((map[toLower(n)] = n), map),
      {} as { [key: string]: string }
    );
    Object.keys(optionMap).forEach((k) => {
      optionMap[k] = dtoOptions[k];
    });

    dto.option1.name = productTypeOption1;
    dto.option1.option = optionMap[toLower(productTypeOption1)];
    dto.option2.name = productTypeOption2;
    dto.option2.option = optionMap[toLower(productTypeOption2)];
    dto.option3.name = productTypeOption3;
    dto.option3.option = optionMap[toLower(productTypeOption3)];
    console.log({
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      optionMap,
      dtoOptions,
    });
    let result = ProductVariant.create(dto);
    if (result.isFailure) {
      //TODO: FailedToAddVariant
      return Result.fail(result.error);
    }
    let variant = result.value();
    try {
      variant.setProduct(this);
      this._value.variants.push(variant);
      this._entity.variants.add(variant.entity());
      return Result.ok<ProductVariant>(variant);
    } catch (err) {
      //TODO: FailedToAddVariant
      return Result.fail(err, dto.sku);
    }
  }

  public removeVariant(variant: ProductVariant): Result<Product> {
    try {
      this._value.variants = this._value.variants.filter(
        (v) => v.props().id == variant.props().id
      );
      let dbe = variant.entity();
      if (dbe) this._entity.variants.remove(dbe);
      return Result.ok(this);
    } catch (err) {
      return Result.fail(err, variant.props().sku);
    }
  }

  /** Utility Methods */

  /**
   * Creates a Product from a DTO, or returns Result with errors.
   * @param dto Data Transfer Object representing a Product to be created.
   * @returns {Result<Product>}
   */
  public static create(dto: CreateProductDto): Result<Product> {
    // Validate DTO
    let results = {
      id: dto.id ? ProductUUID.from(dto.id) : Product.generateUuid(),
      customOptions: Product.createCustomOptions(dto.customOptions),
      pricingTier: PricingTier.from(dto.pricingTier),

      type: ProductTypeName.from(dto.type),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProduct(
          errors,
          { ...dto },
          `Failed to create Product. See inner error for details.`
        )
      );
    }
    // Timestamp
    const now = moment().toDate();
    // Props
    const props: IProduct = {
      id: results.id.value(),
      type: results.type.value(),
      pricingTier: results.pricingTier.value(),
      createdAt: now,
      updatedAt: now,
      sku: ProductSKU.from(dto.sku),
      image: ProductImage.from(dto.image).value(),
      svg: ProductSvg.from(dto.svg),
      tags: ProductTags.from(dto.tags),
      // categories: ProductCategories.from(dto.categories),
      customOptions: results.customOptions.value(),
      variants: [],
      productType: null,
    };

    // DBEntity
    const dbe: DbProduct = new DbProduct();

    dbe.id = props.id.value();
    dbe.sku = props.sku.value();

    dbe.pricingTier = props.pricingTier.value();
    dbe.type = props.type.value();
    dbe.image = props.image.value();
    dbe.svg = props.svg.value();
    dbe.tags = props.tags?.value();
    // dbe.categories = props.categories.value();
    dbe.customOptions = props.customOptions?.map((c) => c.props());
    dbe.createdAt = props.createdAt;
    dbe.updatedAt = props.updatedAt;

    // Product
    const product = new Product(props, dbe);

    return Result.ok(product);
  }

  public static db(dbe: DbProduct): Result<Product> {
    let results = {
      customOptions: Product.createCustomOptions(dbe.customOptions),
      variants: Product.loadVariants(dbe),
      pricingTier: PricingTier.from(dbe.pricingTier),
      uuid: ProductUUID.from(dbe.id),
      type: ProductTypeName.from(dbe.type),
    };

    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProduct(
          errors,
          { ...dbe },
          `Failed to generate Product. See inner error for details.`
        )
      );
    }

    const props: IProduct = {
      id: results.uuid.value(),
      pricingTier: results.pricingTier.value(),
      type: results.type.value(),
      sku: ProductSKU.from(dbe.sku),
      image: ProductImage.from(dbe.image).value(),
      svg: ProductSvg.from(dbe.svg),
      tags: ProductTags.from(dbe.tags),
      // categories: ProductCategories.from(dbe.categories),
      customOptions: results.customOptions.value(),
      variants: results.variants.value(),
      createdAt: dbe.createdAt,
      updatedAt: dbe.updatedAt,
      productType: null,
    };
    const product = new Product(props, dbe);
    return Result.ok(product);
  }

  public static generateUuid(): Result<ProductUUID> {
    return ProductUUID.from(UUID.generate());
  }

  private static createCustomOptions(
    customOptions: CustomOptionDto[]
  ): Result<CustomOption[]> {
    try {
      const result = customOptions.map((o) => CustomOption.from(o));
      const errors = result.filter((co) => co.isFailure).map((e) => e.error);
      if (errors.length) {
        return Result.fail(
          new InvalidCustomOptions(errors, { customOptions: customOptions })
        );
      }
      const co = result.map((r) => r.value());
      return Result.ok(co);
    } catch (err) {
      throw err;
    }
  }

  private static loadVariants(dbe: DbProduct): Result<ProductVariant[]> {
    if (dbe.variants.isInitialized()) {
      const vItems = dbe.variants.getItems();
      const result = vItems.map((v) => ProductVariant.db(v));
      const errors = result.filter((co) => co.isFailure).map((e) => e.error);
      if (errors.length) {
        return Result.fail(
          new InvalidProductVariants(errors, {
            variants: vItems,
          })
        );
      }
      const va = result.map((r) => r.value());

      return Result.ok(va);
    } else {
      return Result.ok(null);
    }
  }
}
