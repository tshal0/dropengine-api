import { Injectable, Logger } from "@nestjs/common";
import { ResultError, Result } from "@shared/domain/Result";
import { NumberID, UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import moment from "moment";
import { DbAccount } from "../domain/entities/Account.entity";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import {
  Collection,
  EntityManager,
  EntityRepository,
  FilterQuery,
  wrap,
} from "@mikro-orm/core";
import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { CreateAccountDto } from "@accounts/dto/CreateAccountDto";
import { CompanyCode } from "@accounts/domain/valueObjects/CompanyCode";
import { AccountId } from "@accounts/domain/valueObjects/AccountId";
import { Account } from "@accounts/domain/aggregates/Account";
import { IAccountProps } from "@accounts/domain/interfaces/IAccount";

/**
 * AccountsRepository should have methods for
 * - loading the Account Aggregate into memory
 * - persisting the Account Aggregate (and its CustomOptions, Variants, etc)
 */

export class AccountNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Account not found with ID: ${id}`, id, `ACCOUNT_NOT_FOUND`);
  }
}
export class AccountNotFoundWithCompanyCodeException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Account not found with CompanyCode: ${id}`, id, `ACCOUNT_NOT_FOUND`);
  }
}

export enum AccountRepositoryError {
  FailedToLoadAccountFromDb = "FailedToLoadAccountFromDb",
  FailedToConvertAccountToDb = "FailedToConvertAccountToDb",
  AccountNotFound = "AccountNotFound",
}
export class AccountNotFoundError implements ResultError {
  public stack: string;
  public name = AccountRepositoryError.AccountNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `[${this.name}]` + `[${value}]: ${reason}`;
  }
}
export class FailedToLoadAccountFromDb implements ResultError {
  public stack: string;
  public name = AccountRepositoryError.FailedToLoadAccountFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: DbAccount,
    public reason: string
  ) {
    this.message =
      `[${AccountRepositoryError.FailedToLoadAccountFromDb}]` +
      `[${value.id}]` +
      `[${value.companyCode}]: ${reason}`;
  }
}

export class FailedToConvertAccountToDb implements ResultError {
  public stack: string;
  public name = AccountRepositoryError.FailedToConvertAccountToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: IAccountProps,
    public reason: string
  ) {
    this.message =
      `[${AccountRepositoryError.FailedToConvertAccountToDb}]` +
      `[${value.id}]` +
      `[${value.companyCode}]: ${reason}`;
  }
}

@Injectable()
export class AccountsRepository {
  private readonly logger: Logger = new Logger(AccountsRepository.name);

  constructor(private readonly em: EntityManager) {}
  get llog() {
    return `[${moment()}][${AccountsRepository.name}]`;
  }

  public async delete(id: AccountId): Promise<Result<void>> {
    let repo = this.em.getRepository(DbAccount);
    let mp = await repo.findOne(id.value());
    if (mp == null) {
      //TODO: AccountNotFound
      return Result.fail(
        new AccountNotFoundError(id, `Database returned null.`)
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
   * Persists the Account Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param agg Account Aggregate to be persisted.
   * @returns {Result<Account>}
   */
  public async save(agg: Account): Promise<Result<Account>> {
    let result: Result<Account> = null;
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

  private async upsertById(product: Account): Promise<Result<Account>> {
    try {
      let repo = this.em.getRepository(DbAccount);
      const dbe = product.entity();
      await repo.persistAndFlush(dbe);
      return Result.ok(product);
    } catch (err) {
      return this.failedToSave(product.props(), err);
    }
  }

  private async upsertByCompanyCode(
    props: IAccountProps
  ): Promise<Result<Account>> {
    try {
      let repo = this.em.getRepository(DbAccount);
      let e = await repo.findOne({ companyCode: props.companyCode });
      if (e) {
        DbAccount.copy(props, e);
        return await this.persist(repo, e);
      } else {
        return await this.create(props);
      }
    } catch (err) {
      return this.failedToSave(props, err);
    }
  }

  private async persist(
    repo: EntityRepository<DbAccount>,
    dbe: DbAccount
  ): Promise<Result<Account>> {
    await repo.persistAndFlush(dbe);
    let result = Account.db(dbe);
    return result;
  }
  private async create(props: IAccountProps): Promise<Result<Account>> {
    try {
      let repo = this.em.getRepository(DbAccount);
      let dbe: DbAccount = null;
      dbe = await repo.create(props);
      return await this.persist(repo, dbe);
    } catch (err) {
      return this.failedToCreate(props, err);
    }
  }

  private failedToSave(props: IAccountProps, err: any) {
    this.logger.error(err);
    return Result.fail<Account>(
      new FailedToSaveError(
        {
          id: `${props.id}`,
          type: Account.name,
          name: props.name,
        },
        err.message
      )
    );
  }
  private failedToCreate(props: IAccountProps, err: any) {
    this.logger.error(err);
    return Result.fail<Account>(
      new FailedToCreateError(
        {
          id: `${props.id}`,
          type: Account.name,
          name: props.name,
        },
        err.message
      )
    );
  }

  public async findAll(dto: any): Promise<Result<Account[]>> {
    try {
      let repo = this.em.getRepository(DbAccount);
      const query: FilterQuery<DbAccount> = {};

      let entities = await repo.find(query);

      let props = entities.map((e) => Account.db(e).value());
      return Result.ok(props);
    } catch (error) {
      //TODO: FailedToFindAllAccounts
      return Result.fail(error);
    }
  }

  public async load(dto: AccountId | CompanyCode): Promise<Result<Account>> {
    try {
      if (dto instanceof AccountId) {
        return await this.loadById(dto);
      } else if (dto instanceof CompanyCode) {
        return await this.loadByCompanyCode(dto);
      }
    } catch (error) {
      //TODO: AccountNotFound
      return Result.fail(error);
    }
  }
  public async loadById(id: AccountId) {
    let repo = this.em.getRepository(DbAccount);
    let dbe = await repo.findOne({ id: id.value() }, { populate: ["stores"] });

    if (dbe) {
      if (!dbe.stores.isInitialized()) {
        await dbe.stores.init();
      }
      return Account.db(dbe);
    }

    throw new EntityNotFoundException(`AccountNotFound`, `${id}`);
  }
  public async loadByCompanyCode(companyCode: CompanyCode) {
    let repo = this.em.getRepository(DbAccount);
    let dbe = await repo.findOne(
      { companyCode: companyCode.value() },
      { populate: ["stores"] }
    );

    if (dbe) {
      return Account.db(dbe);
    }

    throw new EntityNotFoundException(`AccountNotFound`, companyCode.value());
  }
}
