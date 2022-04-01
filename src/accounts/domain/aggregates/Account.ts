import { CreateAccountDto } from "@accounts/dto/CreateAccountDto";
import { IAggregate, Result, ResultError } from "@shared/domain";
import { cloneDeep } from "lodash";
import { User } from ".";
import { IUser } from "../interfaces/IUser";
import { CompanyCode } from "../valueObjects/CompanyCode";
import moment from "moment";
import { DbAccount } from "../entities/Account.entity";
import { AccountId } from "../valueObjects/AccountId";

export interface IAccount {
  id: AccountId;
  name: string;

  ownerId: string;
  companyCode: CompanyCode;

  updatedAt: Date;
  createdAt: Date;
}

export interface IAccountProps {
  id: string;
  name: string;
  ownerId: string;
  companyCode: string;

  updatedAt: Date;
  createdAt: Date;
}
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

export class Account extends IAggregate<IAccount, DbAccount, IAccountProps> {
  protected constructor(val: IAccount, dbe: DbAccount) {
    super(val, dbe);
  }

  public get name(): string {
    return this._props.name;
  }

  /**
   * Get the value object of the Product
   * @returns Product
   */
  public value(): IAccount {
    const props: IAccount = cloneDeep(this._props);
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
    this._props.name = val;
    this._entity.name = val;
    return this;
  }

  //TODO: Validate CompanyCode
  public setCompanyCode(val: string) {
    this._props.companyCode = CompanyCode.from(val).value();
    this._entity.companyCode = val;
    return this;
  }

  //TODO: Validate Owner
  public setOwner(val: IUser) {
    this._props.ownerId = User.from(val).props().id;
    this._entity.ownerId = this._props.ownerId;
    return this;
  }

  // public addStore(val: IStore) {
  //   throw new NotImplementedException();
  //   return this;
  // }

  // public removeStore(val: IStore) {
  //   throw new NotImplementedException();
  //   return this;
  // }

  /** UTILITY METHODS */

  public static create(dto: CreateAccountDto): Result<Account> {
    // Validate DTO
    let results = {
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
      id: undefined,
      name: dto.name,
      ownerId: User.from(dto.owner).props().id,
      companyCode: results.companyCode.value(),
      createdAt: now,
      updatedAt: now,
    };

    // DBEntity
    const dbe: DbAccount = new DbAccount();

    dbe.id = AccountId.generate().value();
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
      createdAt: now,
      updatedAt: now,
    };

    // Account
    const account = new Account(props, dbe);

    return Result.ok(account);
  }
}
