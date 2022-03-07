import {
  IAggregate,
  NumberID,
  Result,
  ResultError,
  UUID,
} from "@shared/domain";
import moment from "moment";

import { UnprocessableEntityException } from "@nestjs/common";
import { ProductTypeEvent } from "../events/ProductTypeEvent";
import { CreateProductTypeDto } from "catalog/dto/CreateProductTypeDto";
import {
  Product,
  ProductTypeLivePreview,
  ProductTypeManufacturing,
  ProductTypeName,
  ProductTypeOption,
  ProductTypeUUID,
} from "..";
import { DbProductType } from "../entities/ProductType.entity";
import { IProductType, IProductTypeProps } from "../interfaces";
import { cloneDeep } from "lodash";
import { CreateProductDto } from "@catalog/dto/CreateProductDto";
import {
  InvalidProducts,
  InvalidProductVariants,
} from "../errors/ProductErrors";

/**
 * Aggregates need: events, domain methods, initializers, converters
 */

export enum ProductTypeError {
  InvalidProductType = "InvalidProductType",
  ProductTypeRenameFailed = "ProductTypeRenameFailed",
}

export class InvalidProductType implements ResultError {
  public stack: string;
  public name = ProductTypeError.InvalidProductType;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: CreateProductTypeDto,
    reason: string
  ) {
    this.message = `${this.name} '${value.name}': ${reason}`;
  }
}
export class ProductTypeRenameFailed implements ResultError {
  public stack: string;
  public name = ProductTypeError.ProductTypeRenameFailed;
  public message: string;

  constructor(public inner: ResultError[]) {
    let reason = "Failed to rename ProductType. See inner for details.";
    this.message = `${this.name}: ${reason}`;
  }
}

export class ProductType extends IAggregate<
  IProductType,
  DbProductType,
  IProductTypeProps
> {
  protected _events: ProductTypeEvent[];
  protected constructor(val: IProductType, dbe: DbProductType) {
    super(val, dbe);
  }

  public get name(): ProductTypeName {
    return this._props.name;
  }
  /**
   * Get the value object of the Product
   * @returns Product
   */
  public value(): IProductType {
    const props: IProductType = cloneDeep(this._props);
    return Object.seal(props);
  }

  /**
   * Returns the raw props.
   * @returns {DbProductType}
   */
  public entity(): DbProductType {
    const value: DbProductType = this._entity;

    return Object.seal(value);
  }
  /**
   * Returns the raw props.
   * @returns {DbProductType}
   */
  public props(): IProductTypeProps {
    const value: DbProductType = this._entity;

    return Object.seal(value.props());
  }

  /** Domain Actions */

  public rename(name: string): Result<ProductType> {
    let result = ProductTypeName.from(name);
    if (result.isFailure) {
      return Result.fail(new ProductTypeRenameFailed([result.error]));
    }
    let validName = result.value();
    this._props.name = validName;
    this._entity.name = validName.value();
    return Result.ok(this);
  }

  public update(dto: CreateProductTypeDto) {
    return this;
  }

  public importProduct(dto: CreateProductDto): Result<Product> {
    let p = this._props.products.find(
      (v) => v.sku.value() == dto.sku || v.uuid.value() == dto.uuid
    );
    if (p) {
      return p.update(dto);
    } else {
      return this.addProduct(dto);
    }
  }

  public addProduct(dto: CreateProductDto): Result<Product> {
    let result = Product.create(dto);
    if (result.isFailure) {
      //TODO: FailedToAddProduct
      return Result.fail(result.error);
    }
    let product = result.value();
    try {
      product.setProductType(this);
      this._props.products.push(product);
      this._entity.products.add(product.entity());
      return Result.ok<Product>(product);
    } catch (err) {
      //TODO: FailedToAddProduct
      return Result.fail(err, dto.sku);
    }
  }

  /** Utility Methods */

  public static generateUuid() {
    return UUID.generate();
  }

  public static db(dbe: DbProductType): Result<ProductType> {
    let results: { [key: string]: Result<any> } = {};
    results.uuid = ProductTypeUUID.from(dbe.uuid);
    results.name = ProductTypeName.from(dbe.name);
    results.productionData = ProductTypeManufacturing.from(dbe.productionData);
    results.option1 = ProductTypeOption.from(dbe.option1);
    results.option2 = ProductTypeOption.from(dbe.option2);
    results.option3 = ProductTypeOption.from(dbe.option3);
    results.livePreview = ProductTypeLivePreview.from({
      enabled: false,
      link: null,
      name: null,
      version: null,
      ...dbe.livePreview,
    });
    results.products = ProductType.loadProducts(dbe);

    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);

    if (errors.length) {
      return Result.fail(
        new InvalidProductType(
          errors,
          { ...dbe },
          `Failed to generate ProductType. See inner error for details.`
        )
      );
    }

    const props: IProductType = {
      uuid: results.uuid.value(),
      name: results.name.value(),
      productionData: results.productionData.value(),
      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      livePreview: results.livePreview.value(),
      createdAt: dbe.createdAt,
      updatedAt: dbe.updatedAt,
      products: results.products.value(),
    };
    const productType = new ProductType(props, dbe);
    return Result.ok(productType);
  }

  public static create(dto: CreateProductTypeDto): Result<ProductType> {
    const now = moment().toDate();

    let results = {
      uuid: ProductTypeUUID.from(ProductType.generateUuid()),
      name: ProductTypeName.from(dto.name),
      productionData: ProductTypeManufacturing.from(dto.productionData),
      option1: ProductTypeOption.from(dto.option1),
      option2: ProductTypeOption.from(dto.option2),
      option3: ProductTypeOption.from(dto.option3),
      livePreview: ProductTypeLivePreview.from({
        enabled: false,
        link: null,
        name: null,
        version: null,
        ...dto.livePreview,
      }),
    };

    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidProductType(
          errors,
          { ...dto },
          `Failed to generate ProductType. See inner error for details.`
        )
      );
    }

    const props: IProductType = {
      uuid: results.uuid.value(),
      name: results.name.value(),
      productionData: results.productionData.value(),
      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      livePreview: results.livePreview.value(),
      createdAt: now,
      updatedAt: now,
      products: [],
    };
    const dbe = new DbProductType();
    dbe.uuid = props.uuid.value();
    dbe.name = props.name.value();
    dbe.productionData = props.productionData.value();
    dbe.option1 = props.option1.value();
    dbe.option2 = props.option2.value();
    dbe.option3 = props.option3.value();
    dbe.livePreview = props.livePreview.value();
    dbe.createdAt = now;
    dbe.updatedAt = now;

    const productType = new ProductType(props, dbe);
    return Result.ok(productType);
  }

  raiseEvent(event: ProductTypeEvent) {
    this._events.push(event);
    return this;
  }

  private static loadProducts(dbe: DbProductType): Result<Product[]> {
    if (dbe.products.isInitialized()) {
      const vItems = dbe.products.getItems();
      const result = vItems.map((v) => Product.db(v));
      const errors = result.filter((co) => co.isFailure).map((e) => e.error);
      if (errors.length) {
        return Result.fail(
          new InvalidProducts(errors, {
            products: vItems,
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
