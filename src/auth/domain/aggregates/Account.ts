import { CreateAccountDto } from "@auth/dto/CreateAccountDto";
import { CreateStoreDto } from "@auth/dto/CreateStoreDto";
import { IAggregate, Result, ResultError } from "@shared/domain";
import { cloneDeep } from "lodash";
import { User } from ".";
import { IUser } from "../interfaces/IUser";
import { CompanyCode } from "../valueObjects/CompanyCode";
import moment from "moment";
import { DbAccount } from "../entities/Account.entity";
import { AccountId } from "../valueObjects/AccountId";
import { IAccount, IAccountProps } from "../interfaces/IAccount";
import { InvalidStore, Store } from "./Store";

/**
 * Aggregates need: events, domain methods, initializers, converters
 */

export enum AccountError {
  InvalidAccount = "InvalidAccount",
}

export class InvalidAccount implements ResultError {
  public stack: string;
  public name = AccountError.InvalidAccount;
  public message: string;
  constructor(public inner: ResultError[], public value: any, reason: string) {
    this.message = `${this.name} '${value.name}': ${reason}`;
  }
}

export class Account extends IAggregate<IAccountProps, IAccount, DbAccount> {
  protected constructor(val: IAccount, dbe: DbAccount) {
    super(val, dbe);
  }

  public get name(): string {
    return this._value.name;
  }

  /**
   * Get the value object of the Store
   * @returns Store
   */
  public value(): IAccount {
    const props: IAccount = cloneDeep(this._value);
    return Object.seal(props);
  }

  /**
   * Returns the raw props.
   * @returns {DbAccount}
   */
  public entity(): DbAccount {
    const value: DbAccount = this._entity;
    return Object.seal(value);
  }

  /**
   * Returns the raw props.
   * @returns {DbAccount}
   */
  public props(): IAccountProps {
    const value: DbAccount = this._entity;
    return Object.seal(value.props());
  }

  /** DOMAIN METHODS */

  public setName(val: string) {
    this._value.name = val;
    this._entity.name = val;
    return this;
  }

  //TODO: Validate CompanyCode
  public setCompanyCode(val: string) {
    this._value.companyCode = CompanyCode.from(val).value();
    this._entity.companyCode = val;
    return this;
  }

  //TODO: Validate Owner
  public setOwner(val: IUser) {
    this._value.ownerId = User.from(val).props().id;
    this._entity.ownerId = this._value.ownerId;
    return this;
  }

  public addStore(dto: CreateStoreDto): Result<Store> {
    let result = Store.create(dto);
    if (result.isFailure) {
      //TODO: FailedToAddStore
      return Result.fail(result.error);
    }
    let store = result.value();
    try {
      store.setAccount(this);
      this._value.stores.push(store);
      this._entity.stores.add(store.entity());
      return Result.ok<Store>(store);
    } catch (err) {
      //TODO: FailedToAddStore
      return Result.fail(err, dto.storeName);
    }
  }

  public removeStore(store: Store): Result<Account> {
    try {
      this._value.stores = this._value.stores.filter(
        (v) => v.props().id == store.props().id
      );
      let dbe = store.entity();
      if (dbe) this._entity.stores.remove(dbe);
      return Result.ok(this);
    } catch (err) {
      return Result.fail(err, store.props().id);
    }
  }

  // public removeStore(val: IStore) {
  //   throw new NotImplementedException();
  //   return this;
  // }

  /** UTILITY METHODS */

  public static create(dto: CreateAccountDto): Result<Account> {
    // Validate DTO
    let results = {
      id: dto.id
        ? AccountId.from(dto.id)
        : AccountId.from(AccountId.generate()),
      companyCode: CompanyCode.from(dto.companyCode),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidAccount(
          errors,
          { ...dto },
          `Failed to create Account. See inner error for details.`
        )
      );
    }
    // Timestamp
    const now = moment().toDate();
    // Props
    const props: IAccount = {
      id: results.id.value(),
      name: dto.name,
      ownerId: User.from(dto.owner).props().id,
      companyCode: results.companyCode.value(),
      stores: [],
      createdAt: now,
      updatedAt: now,
    };

    // DBEntity
    const dbe: DbAccount = new DbAccount();

    dbe.id = props.id.value();
    dbe.name = props.name;
    dbe.ownerId = props.ownerId;
    dbe.companyCode = props.companyCode.value();

    dbe.createdAt = props.createdAt;
    dbe.updatedAt = props.updatedAt;

    // Account
    const account = new Account(props, dbe);

    return Result.ok(account);
  }
  public static db(dbe: DbAccount): Result<Account> {
    // Validate DTO
    let results = {
      id: AccountId.from(dbe.id),
      companyCode: CompanyCode.from(dbe.companyCode),
      stores: Account.loadStores(dbe),
    };
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidAccount(
          errors,
          { ...dbe },
          `Failed to create Account. See inner error for details.`
        )
      );
    }
    // Timestamp
    const now = moment().toDate();
    // Props
    const props: IAccount = {
      id: results.id.value(),
      name: dbe.name,
      ownerId: dbe.ownerId,
      companyCode: results.companyCode.value(),
      stores: results.stores.value(),
      createdAt: now,
      updatedAt: now,
    };

    // Account
    const account = new Account(props, dbe);

    return Result.ok(account);
  }
  private static loadStores(dbe: DbAccount): Result<Store[]> {
    if (dbe.stores.isInitialized()) {
      const vItems = dbe.stores.getItems();
      const result = vItems.map((v) => Store.db(v));
      const errors = result.filter((co) => co.isFailure).map((e) => e.error);
      if (errors.length) {
        return Result.fail(
          new InvalidStore(
            errors,
            dbe,
            `Errors found loading Stores into Account.`
          )
        );
      }
      const stores = result.map((r) => r.value());

      return Result.ok(stores);
    } else {
      return Result.ok(null);
    }
  }
}
