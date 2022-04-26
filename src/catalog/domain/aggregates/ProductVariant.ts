import {
  Dimension,
  IDimension,
  IMoney,
  IWeight,
  Money,
  Result,
  ResultError,
  UUID,
  Weight,
} from "@shared/domain";
import { IAggregate } from "@shared/domain/IAggregate";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";
import { IProductVariant, IProductVariantProps } from "../interfaces";
import moment from "moment";
import {
  ICustomOption,
  ICustomOptionProps,
  IProductTypeProductionData,
  IProductTypeProps,
  IVariantOption,
  Product,
  ProductImage,
  ProductTypeUUID,
  ProductUUID,
  VariantSKU,
} from "..";
import { VariantOption } from "../valueObjects/ProductVariant/VariantOption";
import { cloneDeep, compact, toLower } from "lodash";
import { DbProductVariant } from "../entities/ProductVariant.entity";
import { ProductVariantUUID } from "../valueObjects/ProductVariant/VariantUUID";

export enum ProductVariantError {
  InvalidProductVariant = "InvalidProductVariant",
}

export class InvalidProductVariant implements ResultError {
  public stack: string;
  public name = ProductVariantError.InvalidProductVariant;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: { sku: string },
    public reason: string
  ) {
    this.message = `${ProductVariantError.InvalidProductVariant} '${value.sku}': ${reason}`;
  }
}

export class ProductVariant extends IAggregate<
  IProductVariantProps,
  IProductVariant,
  DbProductVariant
> {
  /**
   * Get the value of the Product
   * @returns Product
   */
  public value(): IProductVariant {
    const props: IProductVariant = cloneDeep(this._value);
    return Object.seal(props);
  }
  /**
   * Returns the database entity.
   * @returns {IProductProps}
   */
  public entity(): DbProductVariant {
    const entity = this._entity;
    return Object.seal(entity);
  }
  /**
   * Returns the raw props.
   * @returns {IProductProps}
   */
  public props(maxDepth?: number | undefined): IProductVariantProps {
    const entity = this._entity;
    return Object.seal(entity.props(maxDepth));
  }

  public get id(): string {
    return this._entity.id;
  }
  public get sku(): string {
    return this._entity.sku;
  }

  public get productId(): ProductUUID {
    return ProductUUID.from(this._entity.product?.id).value();
  }

  public get productTypeId(): ProductTypeUUID {
    return ProductTypeUUID.from(this._entity.product?.productType?.id).value();
  }

  public get productionData(): IProductTypeProductionData {
    return this._entity.product?.productType?.productionData;
  }
  public get personalizationRules(): ICustomOptionProps[] {
    return this._entity.product.customOptions;
  }
  public get weight(): IWeight {
    return this._value.weight.value();
  }
  public get height(): IDimension {
    return this._value.height.value();
  }
  public get width(): IDimension {
    return this._value.width.value();
  }
  public get manufacturingCost(): IMoney {
    return this._value.manufacturingCost.value();
  }
  public get shippingCost(): IMoney {
    return this._value.shippingCost.value();
  }
  public get option1(): IVariantOption {
    return this._value.option1.value();
  }
  public get option2(): IVariantOption {
    return this._value.option2.value();
  }
  public get option3(): IVariantOption {
    return this._value.option3.value();
  }
  public get image(): string {
    return this._entity.product.image;
  }
  public get svg(): string {
    return this._entity.product.svg;
  }
  public get type(): string {
    return this._entity.product.type;
  }

  // Domain methods

  public update(dto: CreateProductVariantDto): Result<ProductVariant> {
    const pt = dto.productType ?? this._entity.product.productType;

    const productTypeOption1 = pt.option1?.name;
    const productTypeOption2 = pt.option2?.name;
    const productTypeOption3 = pt.option3?.name;

    if (productTypeOption1?.length && !dto.option1.name?.length)
      dto.option1.name = productTypeOption1;
    if (productTypeOption2?.length && !dto.option2.name?.length)
      dto.option2.name = productTypeOption2;
    if (productTypeOption3?.length && !dto.option3.name?.length)
      dto.option3.name = productTypeOption3;

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

    let results = {
      image: ProductImage.from(dto.image),
      option1: VariantOption.from(dto.option1),
      option2: VariantOption.from(dto.option2),
      option3: VariantOption.from(dto.option3),
      height: Dimension.from(dto.height),
      width: Dimension.from(dto.width),
      weight: Weight.from(dto.weight),
      manufacturingCost: Money.from(dto.manufacturingCost as IMoney),
      shippingCost: Money.from(dto.shippingCost as IMoney),
    };

    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProductVariant(
          errors,
          { sku: dto.sku },
          `Failed to generate Variant for options ` +
            `'${dto.option1?.name}:${dto.option1?.option}', ` +
            `'${dto.option2?.name}:${dto.option2?.option}'. ` +
            `See inner error for details.`
        )
      );
    }
    this.setImage(results.image.value());
    this.setoption1(results.option1.value());
    this.setoption2(results.option2.value());
    this.setoption3(results.option3.value());
    this.setHeight(results.height.value());
    this.setWidth(results.width.value());
    this.setWeight(results.weight.value());
    this.setManufacturingCost(results.manufacturingCost.value());
    this.setShippingCost(results.shippingCost.value());
    return Result.ok(this);
  }

  public setProduct(product: Product) {
    this._entity.product = product.entity();
    return this;
  }

  public setSku(sku: VariantSKU) {
    this._value.sku = sku;
    this._entity.sku = sku.value();
    return this;
  }
  public setImage(value: ProductImage) {
    this._value.image = value;
    this._entity.image = value.value();
    return this;
  }
  public setHeight(value: Dimension) {
    this._value.height = value;
    this._entity.height = value.value();
    return this;
  }
  public setWidth(value: Dimension) {
    this._value.width = value;
    this._entity.width = value.value();
    return this;
  }
  public setWeight(value: Weight) {
    this._value.weight = value;
    this._entity.weight = value.value();
    return this;
  }
  public setoption1(value: VariantOption) {
    this._value.option1 = value;
    this._entity.option1 = value.value();
    return this;
  }
  public setoption2(value: VariantOption) {
    this._value.option2 = value;
    this._entity.option2 = value.value();
    return this;
  }
  public setoption3(value: VariantOption) {
    this._value.option3 = value;
    this._entity.option3 = value.value();
    return this;
  }
  public setManufacturingCost(value: Money) {
    this._value.manufacturingCost = value;
    this._entity.manufacturingCost = value.value();
    return this;
  }
  public setShippingCost(value: Money) {
    this._value.shippingCost = value;
    this._entity.shippingCost = value.value();
    return this;
  }

  // Utility methods
  /**
   *
   * @param dto
   * @returns
   */
  public static create(dto: CreateProductVariantDto): Result<ProductVariant> {
    // TODO: Validate DTO, ProductType, Options
    const pt = dto.productType;

    const productTypeOption1 = pt.option1?.name;
    const productTypeOption2 = pt.option2?.name;
    const productTypeOption3 = pt.option3?.name;

    if (productTypeOption1?.length && !dto.option1.name?.length)
      dto.option1.name = productTypeOption1;
    if (productTypeOption2?.length && !dto.option2.name?.length)
      dto.option2.name = productTypeOption2;
    if (productTypeOption3?.length && !dto.option3.name?.length)
      dto.option3.name = productTypeOption3;

    const dtoOptions = compact([dto.option1, dto.option2, dto.option3]).reduce(
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

    let results = {
      uuid: dto.id
        ? ProductVariantUUID.from(dto.id)
        : ProductVariant.generateUuid(),
      image: ProductImage.from(dto.image),
      sku: VariantSKU.from(dto.sku),

      option1: VariantOption.from(dto.option1),
      option2: VariantOption.from(dto.option2),
      option3: VariantOption.from(dto.option3),

      height: Dimension.from(dto.height),
      width: Dimension.from(dto.width),
      weight: Weight.from(dto.weight),

      manufacturingCost: Money.from(dto.manufacturingCost as IMoney),
      shippingCost: Money.from(dto.shippingCost as IMoney),
    };

    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProductVariant(
          errors,
          { sku: dto.sku },
          `Failed to generate Variant for options ` +
            `'${dto.option1?.name}:${dto.option1?.option}', ` +
            `'${dto.option2?.name}:${dto.option2?.option}'. ` +
            `See inner error for details.`
        )
      );
    }

    // Timestamp
    const now = moment().toDate();

    // Props
    let props: IProductVariant = {
      id: results.uuid.value(),
      image: results.image.value(),
      sku: results.sku.value(),

      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      height: results.height.value(),
      width: results.width.value(),
      weight: results.weight.value(),
      manufacturingCost: results.manufacturingCost.value(),
      shippingCost: results.shippingCost.value(),
      createdAt: now,
      updatedAt: now,
    };

    // DBEntity

    const dbe = new DbProductVariant();
    dbe.id = props.id.value();
    dbe.image = props.image.value();
    dbe.sku = props.sku.value();

    dbe.option1 = props.option1.value();
    dbe.option2 = props.option2.value();
    dbe.option3 = props.option3.value();

    dbe.height = props.height.value();
    dbe.width = props.width.value();
    dbe.weight = props.weight.value();

    dbe.manufacturingCost = props.manufacturingCost.value();
    dbe.shippingCost = props.shippingCost.value();

    dbe.createdAt = props.createdAt;
    dbe.updatedAt = props.updatedAt;

    // ProductVariant
    const entity = new ProductVariant(props, dbe);
    return Result.ok(entity);
  }
  public static db(dbe: DbProductVariant): Result<ProductVariant> {
    let results = {
      id: ProductVariantUUID.from(dbe.id),
      image: ProductImage.from(dbe.image),
      sku: VariantSKU.from(dbe.sku),

      option1: VariantOption.from(dbe.option1),
      option2: VariantOption.from(dbe.option2),
      option3: VariantOption.from(dbe.option3),

      height: Dimension.from(dbe.height),
      width: Dimension.from(dbe.width),
      weight: Weight.from(dbe.weight),

      manufacturingCost: Money.from(dbe.manufacturingCost as IMoney),
      shippingCost: Money.from(dbe.shippingCost as IMoney),
    };
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProductVariant(
          errors,
          { sku: dbe.sku },
          `Failed to generate Variant for options ` +
            `'${dbe.option1?.name}:${dbe.option1?.option}', ` +
            `'${dbe.option2?.name}:${dbe.option2?.option}'. ` +
            `See inner error for details.`
        )
      );
    }
    let props: IProductVariant = {
      id: results.id.value(),
      image: results.image.value(),
      sku: results.sku.value(),

      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      height: results.height.value(),
      width: results.width.value(),
      weight: results.weight.value(),
      manufacturingCost: results.manufacturingCost.value(),
      shippingCost: results.shippingCost.value(),
      createdAt: dbe.createdAt,
      updatedAt: dbe.updatedAt,
    };

    const entity = new ProductVariant(props, dbe);
    return Result.ok(entity);
  }
  public static generateUuid(): Result<ProductVariantUUID> {
    return ProductVariantUUID.from(UUID.generate());
  }
}
