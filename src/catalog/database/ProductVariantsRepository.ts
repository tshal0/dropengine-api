import { Injectable } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { ProductVariant } from "../domain/aggregates/ProductVariant";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { EntityManager } from "@mikro-orm/core";
import {
  DbProductVariant,
  IProductVariantProps,
  VariantSKU,
} from "@catalog/domain";
import { VariantQueryDto } from "@catalog/dto";
import { ProductVariantUUID } from "@catalog/domain/valueObjects/ProductVariant/VariantUUID";

/**
 * ProductVariantsRepository should have methods for
 * - loading the ProductVariant Aggregate into memory
 * - persisting the ProductVariant Aggregate (and its CustomOptions, Variants, etc)
 */

export class ProductVariantNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductVariant not found with ID: ${id}`, id, `USER_NOT_FOUND`);
  }
}
export class ProductVariantNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductVariant not found with Email: ${id}`, id, `USER_NOT_FOUND`);
  }
}

export enum ProductVariantRepositoryError {
  FailedToLoadProductVariantFromDb = "FailedToLoadProductVariantFromDb",
  FailedToConvertProductVariantToDb = "FailedToConvertProductVariantToDb",
  ProductVariantNotFound = "ProductVariantNotFound",
}
export class ProductVariantNotFoundError implements ResultError {
  public stack: string;
  public name = ProductVariantRepositoryError.ProductVariantNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `[${this.name}]` + `[${value}]: ${reason}`;
  }
}

export class FailedToLoadProductVariantFromDb implements ResultError {
  public stack: string;
  public name = ProductVariantRepositoryError.FailedToLoadProductVariantFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: DbProductVariant,
    public reason: string
  ) {
    this.message =
      `[${ProductVariantRepositoryError.FailedToLoadProductVariantFromDb}]` +
      `[${value.id}]` +
      `[${value.sku}]: ${reason}`;
  }
}

export class FailedToConvertProductVariantToDb implements ResultError {
  public stack: string;
  public name = ProductVariantRepositoryError.FailedToConvertProductVariantToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: IProductVariantProps,
    public reason: string
  ) {
    this.message =
      `[${ProductVariantRepositoryError.FailedToConvertProductVariantToDb}]` +
      `[${value.id}]` +
      `[${value.sku}]: ${reason}`;
  }
}

@Injectable()
export class ProductVariantsRepository {
  constructor(
    private readonly logger: AzureLoggerService,
    private readonly em: EntityManager
  ) {}
  get llog() {
    return `[${moment()}][${ProductVariantsRepository.name}]`;
  }

  public async query(
    query: VariantQueryDto
  ): Promise<Result<ProductVariant>[]> {
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.find({}, { populate: ["product"] });
    let results = dbe.map((v) => ProductVariant.db(v));
    return results;
  }

  public async findById(
    id: ProductVariantUUID
  ): Promise<Result<ProductVariant>> {
    let repo = this.em.getRepository(DbProductVariant);
    let mp = await repo.findOne(id.value(), {
      populate: ["product.productType"],
    });
    if (mp == null) {
      //TODO: ProductVariantNotFound
      return Result.fail(
        new ProductVariantNotFoundError(id.value(), `Database returned null.`)
      );
    }
    let result = ProductVariant.db(mp);
    return result;
  }

  public async findBySku(sku: VariantSKU): Promise<Result<ProductVariant>> {
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.findOne(
      { sku: sku.value() },
      { populate: ["product.productType"] }
    );
    if (dbe == null) {
      //TODO: ProductVariantNotFound
      return Result.fail(
        new ProductVariantNotFoundError(sku.value(), `Database returned null.`)
      );
    }
    let result = ProductVariant.db(dbe);
    return result;
  }

  /**
   * Persists the ProductVariant Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg ProductVariant Aggregate to be persisted.
   * @returns {Result<ProductVariant>}
   */
  // public async save(agg: ProductVariant): Promise<Result<ProductVariant>> {
  //   let result: Result<ProductVariant> = null;
  //   const props = agg?.props();
  //   try {
  //     if (props.sku?.length) {
  //       result = await this.upsertBySku(props);
  //     } else if (props.uuid?.length) {
  //       result = await this.upsertByUuid(props);
  //     } else if (props.id) {
  //       result = await this.upsertById(props);
  //     } else {
  //       result = await this.create(props);
  //     }

  //     return result;
  //   } catch (err) {
  //     return this.failedToSave(props, err);
  //   }
  // }

  public async delete(uuid: UUID): Promise<Result<void>> {
    let repo = this.em.getRepository(DbProductVariant);
    let mp = await repo.findOne(uuid.value());
    if (mp == null) {
      //TODO: ProductVariantNotFound
      return Result.fail();
    }
    try {
      await repo.removeAndFlush(mp);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  public async findAll(): Promise<Result<IProductVariantProps[]>> {
    try {
      let repo = this.em.getRepository(DbProductVariant);
      let entities = await repo.findAll();
      let props = entities.map((e) => e.props());
      return Result.ok(props);
    } catch (error) {
      //TODO: FailedToFindAllProductVariants
      return Result.fail(error);
    }
  }
}
