import { Injectable, Logger } from "@nestjs/common";
import { Result, ResultError } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { ProductType } from "../domain/aggregates/ProductType";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";

import { EntityManager } from "@mikro-orm/postgresql";
import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { NumberID, UUID } from "@shared/domain";

import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { CreateProductTypeDto } from "@catalog/dto/ProductType/CreateProductTypeDto";
import {
  DbProduct,
  DbProductType,
  IProductTypeProps,
  ProductTypeName,
} from "@catalog/domain";

export class ProductTypeNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductType not found with ID: ${id}`, id, `USER_NOT_FOUND`);
  }
}
export class ProductTypeNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductType not found with Email: ${id}`, id, `USER_NOT_FOUND`);
  }
}

@Injectable()
export class ProductTypesRepository {
  private readonly logger: Logger = new Logger(ProductTypesRepository.name);

  constructor(
    private readonly em: EntityManager
  ) {}
  get llog() {
    return `[${moment()}][${ProductTypesRepository.name}]`;
  }

  public async delete(uuid: UUID): Promise<Result<void>> {
    this.logger.debug(`${this.llog} Deleting ProductType '${uuid.value()}'`);
    let repo = this.em.getRepository(DbProductType);

    let mp = await repo.findOne(uuid.value());
    if (mp == null) {
      //TODO: ProductTypeNotFound
      return Result.ok();
    }
    try {
      if (!mp.products.isInitialized()) {
        this.logger.log(
          `${this.llog} Initializing products for type '${mp.name}'`
        );
        await mp.products.init();
      }
      for (const product of mp.products) {
        if (!product.variants.isInitialized()) {
          this.logger.log(
            `${this.llog} Initializing variants for product '${product.sku}'`
          );
          await product.variants.init();
        }
        this.logger.log(
          `${this.llog} Removing variants for product '${product.sku}'`
        );
        product.variants.removeAll();
      }
      this.logger.log(`${this.llog} Removing products for type '${mp.name}'`);
      mp.products.removeAll();
      this.logger.log(`${this.llog} Removing product type '${mp.name}'`);
      await repo.removeAndFlush(mp);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  /**
   * Persists the ProductType Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg ProductType Aggregate to be persisted.
   * @returns {Result<ProductType>}
   */
  public async save(agg: ProductType): Promise<Result<ProductType>> {
    let result: Result<ProductType> = null;
    const props = agg?.props();
    try {
      if (props.id?.length) {
        result = await this.upsertByUuid(agg);
      }
      if (props.name?.length) {
        result = await this.upsertByName(agg);
      } else {
        result = await this.create(props);
      }
      return result;
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async upsertByUuid(
    product: ProductType
  ): Promise<Result<ProductType>> {
    try {
      let repo = this.em.getRepository(DbProductType);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async upsertByName(
    product: ProductType
  ): Promise<Result<ProductType>> {
    try {
      let repo = this.em.getRepository(DbProductType);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async create(props: IProductTypeProps): Promise<Result<ProductType>> {
    try {
      let repo = this.em.getRepository(DbProductType);
      let dbe: DbProductType = null;
      dbe = await repo.create(props);
      return await this.persist(repo, dbe);
    } catch (err) {
      return this.failedToCreate(props, err);
    }
  }
  private async persist(
    repo: EntityRepository<DbProductType>,
    dbe: DbProductType
  ): Promise<Result<ProductType>> {
    await repo.persistAndFlush(dbe);
    let result = ProductType.db(dbe);
    return result;
  }

  private failedToCreate(props: IProductTypeProps, err: any) {
    this.logger.error(err);
    return Result.fail<ProductType>(
      new FailedToCreateError(
        {
          id: props.id,
          type: ProductType.name,
          name: props.name,
        },
        err.message
      )
    );
  }
  private failedToSave(props: IProductTypeProps, err: any) {
    this.logger.error(err);
    return Result.fail<ProductType>(
      new FailedToSaveError(
        {
          id: props.id,
          type: ProductType.name,
          name: props.name,
        },
        err.message
      )
    );
  }
  public async findAll(): Promise<Result<IProductTypeProps[]>> {
    try {
      let repo = this.em.getRepository(DbProductType);
      let entities = await repo.findAll({ populate: ["products"] });
      let props = entities.map((e) => e.props());
      return Result.ok(props);
    } catch (error) {
      //TODO: FailedToFindAllProductTypes
      return Result.fail(error);
    }
  }

  public async load(
    dto: CreateProductTypeDto | UUID | ProductTypeName
  ): Promise<Result<ProductType>> {
    try {
      let repo = this.em.getRepository(DbProductType);

      if (dto instanceof CreateProductTypeDto) {
        return await this.loadByDto(dto, repo);
      } else if (dto instanceof UUID) {
        return await this.loadByUuid(dto, repo);
      } else if (dto instanceof ProductTypeName) {
        return await this.loadByName(dto, repo);
      }
    } catch (error) {
      //TODO: ProductTypeNotFound
      return Result.fail(error);
    }
  }
  private async loadByDto(
    dto: CreateProductTypeDto,
    repo: EntityRepository<DbProductType>
  ) {
    let dbe: DbProductType = null;
    if (dto.id?.length) {
      dbe = await repo.findOne({ id: dto.id }, { populate: ["products"] });
    } else if (dto.name?.length) {
      dbe = await repo.findOne({ name: dto.name }, { populate: ["products"] });
    } else {
      //TODO: InvalidProductType: MissingIdentifier
    }
    if (dbe) {
      if (!dbe.products.isInitialized()) {
        await dbe.products.init();
      }
      return ProductType.db(dbe);
    }
    return ProductType.create(dto);
  }
  private async loadByUuid(uuid: UUID, repo: EntityRepository<DbProductType>) {
    let dbe = await repo.findOne({ id: uuid.value() });

    if (dbe) {
      if (!dbe.products.isInitialized()) {
        await dbe.products.init();
      }
      return ProductType.db(dbe);
    }

    throw new EntityNotFoundException(`ProductTypeNotFound`, uuid.value());
  }
  private async loadByName(
    name: ProductTypeName,
    repo: EntityRepository<DbProductType>
  ) {
    let dbe = await repo.findOne({ name: name.value() });

    if (dbe) {
      if (!dbe.products.isInitialized()) {
        await dbe.products.init();
      }
      return ProductType.db(dbe);
    }

    throw new EntityNotFoundException(`ProductTypeNotFound`, name.value());
  }
  public static toDb(agg: ProductType): Result<DbProductType> {
    const entity = agg.entity();
    return Result.ok(entity);
  }
  public static fromDb(entity: DbProductType): Result<ProductType> {
    const result = ProductType.db(entity);
    //TODO: ProductFromDbFailed
    if (result.isFailure) return Result.fail();
    return result;
  }
}
