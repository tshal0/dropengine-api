import { IAggregate, Result, ResultError } from "@shared/domain";
import { cloneDeep } from "lodash";
import { User } from ".";
import { IUser } from "../interfaces/IUser";
import { CompanyCode } from "../valueObjects/CompanyCode";
import moment from "moment";
import { IStore, IStoreProps } from "../interfaces/IStore";
import { DbStore } from "../entities/Store.entity";
import { CreateStoreDto } from "@identity/dto/CreateStoreDto";
import { StoreId } from "../valueObjects/StoreId";
import { AccountId } from "../valueObjects/AccountId";
import { Account } from "./Account";

/**
 * Aggregates need: events, domain methods, initializers, converters
 */

export enum StoreError {
  InvalidStore = "InvalidStore",
}

export class InvalidStore implements ResultError {
  public stack: string;
  public name = StoreError.InvalidStore;
  public message: string;
  constructor(public inner: ResultError[], public value: any, reason: string) {
    this.message = `${this.name} '${value.name}': ${reason}`;
  }
}

export class Store extends IAggregate<IStoreProps, IStore, DbStore> {
  protected constructor(val: IStore, dbe: DbStore) {
    super(val, dbe);
  }

  public get name(): string {
    return this._value.name;
  }

  /**
   * Get the value object of the Product
   * @returns Product
   */
  public value(): IStore {
    const props: IStore = cloneDeep(this._value);
    return Object.seal(props);
  }

  /**
   * Returns the raw props.
   * @returns {DbStore}
   */
  public entity(): DbStore {
    const value: DbStore = this._entity;
    return Object.seal(value);
  }

  /**
   * Returns the raw props.
   * @returns {DbStore}
   */
  public props(): IStoreProps {
    const value: DbStore = this._entity;
    return Object.seal(value.props());
  }

  /** DOMAIN METHODS */

  public setName(val: string) {
    this._value.name = val;
    this._entity.name = val;
    return this;
  }

  public setAccount(value: Account) {
    this._value.account = value;
    this._entity.account = value.entity();
    return this;
  }

  /** UTILITY METHODS */

  public static create(dto: CreateStoreDto): Result<Store> {
    // Validate DTO
    let results = {
      accountId: AccountId.from(dto.accountId),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidStore(
          errors,
          { ...dto },
          `Failed to create Store. See inner error for details.`
        )
      );
    }
    // Timestamp
    const now = moment().toDate();
    // Props
    const props: IStore = {
      id: StoreId.generate(),
      name: dto.storeName,
      createdAt: now,
      updatedAt: now,
      account: null,
    };

    // DBEntity
    const dbe: DbStore = new DbStore();

    dbe.id = props.id.value();
    dbe.name = props.name;
    dbe.createdAt = props.createdAt;
    dbe.updatedAt = props.updatedAt;

    // Store
    const store = new Store(props, dbe);

    return Result.ok(store);
  }
  public static db(dbe: DbStore): Result<Store> {
    // Validate DTO
    let results = {
      id: StoreId.from(dbe.id),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidStore(
          errors,
          { ...dbe },
          `Failed to create Store. See inner error for details.`
        )
      );
    }
    // Props
    const props: IStore = {
      id: results.id.value(),
      name: dbe.name,

      createdAt: dbe.createdAt,
      updatedAt: dbe.updatedAt,
      account: null,
    };

    // Store
    const store = new Store(props, dbe);

    return Result.ok(store);
  }
}
