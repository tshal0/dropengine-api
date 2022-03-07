import { Injectable } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { NumberID, UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { Product } from "../domain/aggregates/Product";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { IProductProps } from "catalog/domain/interfaces";
import { DbProduct } from "catalog/domain/entities/Product.entity";
import {
  Collection,
  EntityManager,
  EntityRepository,
  wrap,
} from "@mikro-orm/core";
import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { DbProductVariant } from "catalog/domain/entities/ProductVariant.entity";
import { ProductSKU, ProductUUID } from "@catalog/domain";
import { CreateProductDto } from "@catalog/dto/CreateProductDto";
import { ProductType } from "@catalog/domain/aggregates/ProductType";

/**
 * ProductsRepository should have methods for
 * - loading the Product Aggregate into memory
 * - persisting the Product Aggregate (and its CustomOptions, Variants, etc)
 */

export class ProductNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Product not found with ID: ${id}`, id, `USER_NOT_FOUND`);
  }
}
export class ProductNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Product not found with Email: ${id}`, id, `USER_NOT_FOUND`);
  }
}

export enum ProductRepositoryError {
  FailedToLoadProductFromDb = "FailedToLoadProductFromDb",
  FailedToConvertProductToDb = "FailedToConvertProductToDb",
  ProductNotFound = "ProductNotFound",
}
export class ProductNotFoundError implements ResultError {
  public stack: string;
  public name = ProductRepositoryError.ProductNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `[${this.name}]` + `[${value}]: ${reason}`;
  }
}
export class FailedToLoadProductFromDb implements ResultError {
  public stack: string;
  public name = ProductRepositoryError.FailedToLoadProductFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: DbProduct,
    public reason: string
  ) {
    this.message =
      `[${ProductRepositoryError.FailedToLoadProductFromDb}]` +
      `[${value.uuid}]` +
      `[${value.sku}]: ${reason}`;
  }
}

export class FailedToConvertProductToDb implements ResultError {
  public stack: string;
  public name = ProductRepositoryError.FailedToConvertProductToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: IProductProps,
    public reason: string
  ) {
    this.message =
      `[${ProductRepositoryError.FailedToConvertProductToDb}]` +
      `[${value.uuid}]` +
      `[${value.sku}]: ${reason}`;
  }
}

@Injectable()
export class ProductsRepository {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly em: EntityManager
  ) {}
  get llog() {
    return `[${moment()}][${ProductsRepository.name}]`;
  }

  public async delete(uuid: UUID): Promise<Result<void>> {
    let repo = this.em.getRepository(DbProduct);
    let mp = await repo.findOne(uuid.value());
    if (mp == null) {
      //TODO: ProductNotFound
      return Result.fail(
        new ProductNotFoundError(uuid.value(), `Database returned null.`)
      );
    }
    try {
      await repo.removeAndFlush(mp);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  /**
   * Persists the Product Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg Product Aggregate to be persisted.
   * @returns {Result<Product>}
   */
  public async save(agg: Product): Promise<Result<Product>> {
    let result: Result<Product> = null;
    const props = agg?.props();
    try {
      if (props.uuid?.length) {
        result = await this.upsertByUuid(agg);
      } else if (props.sku?.length) {
        result = await this.upsertBySku(props);
      } else {
        result = await this.create(props);
      }

      return result;
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async upsertByUuid(product: Product): Promise<Result<Product>> {
    try {
      let repo = this.em.getRepository(DbProduct);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async upsertBySku(props: IProductProps): Promise<Result<Product>> {
    try {
      let repo = this.em.getRepository(DbProduct);
      let e = await repo.findOne(
        { sku: props.sku },
        { populate: ["variants"] }
      );
      if (e) {
        DbProduct.copy(props, e);
        return await this.persist(repo, e);
      } else {
        return await this.create(props);
      }
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async persist(
    repo: EntityRepository<DbProduct>,
    dbe: DbProduct
  ): Promise<Result<Product>> {
    await repo.persistAndFlush(dbe);
    let result = Product.db(dbe);
    return result;
  }
  private async create(props: IProductProps): Promise<Result<Product>> {
    try {
      let repo = this.em.getRepository(DbProduct);
      let dbe: DbProduct = null;
      dbe = await repo.create(props);
      return await this.persist(repo, dbe);
    } catch (err) {
      return this.failedToCreate(props, err);
    }
  }

  private failedToSave(props: IProductProps, err: any) {
    this.logger.error(err);
    return Result.fail<Product>(
      new FailedToSaveError(
        {
          id: props.uuid,
          type: Product.name,
          name: props.sku,
        },
        err.message
      )
    );
  }
  private failedToCreate(props: IProductProps, err: any) {
    this.logger.error(err);
    return Result.fail<Product>(
      new FailedToCreateError(
        {
          id: props.uuid,
          type: Product.name,
          name: props.sku,
        },
        err.message
      )
    );
  }

  public async findAll(): Promise<Result<IProductProps[]>> {
    try {
      let repo = this.em.getRepository(DbProduct);
      let entities = await repo.findAll({ populate: ["productType"] });
      let props = entities.map((e) => e.props());
      return Result.ok(props);
    } catch (error) {
      //TODO: FailedToFindAllProducts
      return Result.fail(error);
    }
  }

  public async load(
    dto: CreateProductDto | ProductUUID | ProductSKU,
    type: ProductType
  ): Promise<Result<Product>> {
    try {
      if (dto instanceof CreateProductDto) {
        return await this.loadByDto(dto);
      } else if (dto instanceof ProductUUID) {
        return await this.loadByUuid(dto);
      } else if (dto instanceof ProductSKU) {
        return await this.loadBySku(dto);
      }
    } catch (error) {
      //TODO: ProductNotFound
      return Result.fail(error);
    }
  }
  public async loadByDto(dto: CreateProductDto) {
    let repo = this.em.getRepository(DbProduct);
    let dbe: DbProduct = null;
    if (dto.uuid?.length) {
      dbe = await repo.findOne(
        { uuid: dto.uuid },
        { populate: ["productType"] }
      );
    } else if (dto.sku?.length) {
      dbe = await repo.findOne({ sku: dto.sku }, { populate: ["productType"] });
    } else {
      //TODO: InvalidProduct: MissingIdentifier
    }
    if (dbe) {
      if (!dbe.variants.isInitialized()) {
        await dbe.variants.init();
      }
      return Product.db(dbe);
    }
    return Product.create(dto);
  }
  public async loadByUuid(uuid: ProductUUID) {
    let repo = this.em.getRepository(DbProduct);
    let dbe = await repo.findOne(
      { uuid: uuid.value() },
      { populate: ["productType"] }
    );

    if (dbe) {
      if (!dbe.variants.isInitialized()) {
        await dbe.variants.init();
      }
      return Product.db(dbe);
    }

    throw new EntityNotFoundException(`ProductNotFound`, uuid.value());
  }
  public async loadBySku(sku: ProductSKU) {
    let repo = this.em.getRepository(DbProduct);
    let dbe = await repo.findOne(
      { sku: sku.value() },
      { populate: ["productType"] }
    );

    if (dbe) {
      if (!dbe.variants.isInitialized()) {
        await dbe.variants.init();
      }
      return Product.db(dbe);
    }

    throw new EntityNotFoundException(`ProductNotFound`, sku.value());
  }

  public static toDb(agg: Product): Result<DbProduct> {
    const product = agg.value();
    let dbe = new DbProduct();

    dbe.uuid = product.uuid.value();
    dbe.sku = product.sku.value();
    dbe.pricingTier = product.pricingTier.value();
    dbe.tags = product.tags.value();
    dbe.type = product.type.value();
    // dbe.categories = product.categories.value();
    dbe.image = product.image.value();
    dbe.svg = product.svg.value();
    dbe.customOptions = product.customOptions.map((c) => c.props());
    dbe.createdAt = product.createdAt;
    dbe.updatedAt = product.updatedAt;
    dbe.variants = new Collection<DbProductVariant>(this);
    return Result.ok(dbe);
  }

  public static fromDb(entity: DbProduct): Result<Product> {
    const product = Product.db(entity).value();
    return Result.ok(product);
  }
}
