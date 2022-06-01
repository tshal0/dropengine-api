import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { DbStore } from "../domain/entities/Store.entity";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { EntityManager, EntityRepository, FilterQuery } from "@mikro-orm/core";
import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { StoreId } from "@identity/domain/valueObjects/StoreId";
import { Store } from "@identity/domain/aggregates/Store";
import { IStoreProps } from "@identity/domain/interfaces/IStore";

/**
 * StoresRepository should have methods for
 * - loading the Store Aggregate into memory
 * - persisting the Store Aggregate (and its CustomOptions, Variants, etc)
 */

export class StoreNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Store not found with ID: ${id}`, id, `ACCOUNT_NOT_FOUND`);
  }
}

export enum StoreRepositoryError {
  FailedToLoadStoreFromDb = "FailedToLoadStoreFromDb",
  FailedToConvertStoreToDb = "FailedToConvertStoreToDb",
  StoreNotFound = "StoreNotFound",
}
export class StoreNotFoundError implements ResultError {
  public stack: string;
  public name = StoreRepositoryError.StoreNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `[${this.name}]` + `[${value}]: ${reason}`;
  }
}
export class FailedToLoadStoreFromDb implements ResultError {
  public stack: string;
  public name = StoreRepositoryError.FailedToLoadStoreFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: DbStore,
    public reason: string
  ) {
    this.message =
      `[${StoreRepositoryError.FailedToLoadStoreFromDb}]` +
      `[${value.id}]: ${reason}`;
  }
}

export class FailedToConvertStoreToDb implements ResultError {
  public stack: string;
  public name = StoreRepositoryError.FailedToConvertStoreToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: IStoreProps,
    public reason: string
  ) {
    this.message =
      `[${StoreRepositoryError.FailedToLoadStoreFromDb}]` +
      `[${value.id}]: ${reason}`;
  }
}

@Injectable()
export class StoresRepository {
  private readonly logger: Logger = new Logger(StoresRepository.name);

  constructor(private readonly em: EntityManager) {}
  get llog() {
    return `[${moment()}][${StoresRepository.name}]`;
  }

  public async delete(id: StoreId): Promise<Result<void>> {
    let repo = this.em.getRepository(DbStore);
    let mp = await repo.findOne(id.value());
    if (mp == null) {
      //TODO: StoreNotFound
      return Result.fail(new StoreNotFoundError(id, `Database returned null.`));
    }
    try {
      await repo.removeAndFlush(mp);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  /**
   * Persists the Store Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg Store Aggregate to be persisted.
   * @returns {Result<Store>}
   */
  public async save(agg: Store): Promise<Result<Store>> {
    let result: Result<Store> = null;
    const props = agg?.props();
    try {
      if (props.id) {
        result = await this.upsertById(agg);
      } else {
        result = await this.create(props);
      }

      return result;
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async upsertById(product: Store): Promise<Result<Store>> {
    try {
      let repo = this.em.getRepository(DbStore);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async persist(
    repo: EntityRepository<DbStore>,
    dbe: DbStore
  ): Promise<Result<Store>> {
    await repo.persistAndFlush(dbe);
    let result = Store.db(dbe);
    return result;
  }
  private async create(props: IStoreProps): Promise<Result<Store>> {
    try {
      let repo = this.em.getRepository(DbStore);
      let dbe: DbStore = null;
      dbe = await repo.create(props);
      return await this.persist(repo, dbe);
    } catch (err) {
      return this.failedToCreate(props, err);
    }
  }

  private failedToSave(props: IStoreProps, err: any) {
    this.logger.error(err);
    return Result.fail<Store>(
      new FailedToSaveError(
        {
          id: `${props.id}`,
          type: Store.name,
          name: props.name,
        },
        err.message
      )
    );
  }
  private failedToCreate(props: IStoreProps, err: any) {
    this.logger.error(err);
    return Result.fail<Store>(
      new FailedToCreateError(
        {
          id: `${props.id}`,
          type: Store.name,
          name: props.name,
        },
        err.message
      )
    );
  }

  public async findAll(dto: any): Promise<Result<Store[]>> {
    try {
      let repo = this.em.getRepository(DbStore);
      const query: FilterQuery<DbStore> = {};

      let entities = await repo.find(query);

      let props = entities.map((e) => Store.db(e).value());
      return Result.ok(props);
    } catch (error) {
      //TODO: FailedToFindAllStores
      return Result.fail(error);
    }
  }

  public async load(dto: StoreId): Promise<Result<Store>> {
    try {
      if (dto instanceof StoreId) {
        return await this.loadById(dto);
      }
      throw new UnprocessableEntityException(
        {},
        `ID provided is not a valid StoreId.`
      );
    } catch (error) {
      //TODO: StoreNotFound
      return Result.fail(error);
    }
  }
  public async loadById(id: StoreId) {
    let repo = this.em.getRepository(DbStore);
    let dbe = await repo.findOne({ id: id.value() });

    if (dbe) {
      return Store.db(dbe);
    }

    throw new EntityNotFoundException(`StoreNotFound`, `${id}`);
  }
}
