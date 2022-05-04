/**
 * SalesLineItemsRepository should have methods for
 * - loading the SalesLineItem Aggregate into memory
 * - persisting the SalesLineItem Aggregate (and its CustomOptions, Variants, etc)
 */
import { Injectable, Logger, NotImplementedException } from "@nestjs/common";
import moment from "moment";

import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { ResultError, Result } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { MongoSalesLineItem, MongoLineItemsRepository } from "./mongo";
import { ISalesLineItemProps, SalesLineItem } from "..";

export class SalesLineItemNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `SalesLineItem not found with ID: ${id}`,
      id,
      `SALES_ORDER_NOT_FOUND`
    );
  }
}
export class SalesLineItemNotFoundWithOrderNumberException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `SalesLineItem not found with OrderNumber: ${id}`,
      id,
      `SALES_ORDER_NOT_FOUND`
    );
  }
}

export enum SalesLineItemRepositoryError {
  FailedToLoadSalesLineItemFromDb = "FailedToLoadSalesLineItemFromDb",
  FailedToConvertSalesLineItemToDb = "FailedToConvertSalesLineItemToDb",
  SalesLineItemNotFound = "SalesLineItemNotFound",
}
export class SalesLineItemNotFoundError implements ResultError {
  public stack: string;
  public name = SalesLineItemRepositoryError.SalesLineItemNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class FailedToLoadSalesLineItemFromDb implements ResultError {
  public stack: string;
  public name = SalesLineItemRepositoryError.FailedToLoadSalesLineItemFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: MongoSalesLineItem,
    public reason: string
  ) {
    this.message =
      `${SalesLineItemRepositoryError.FailedToLoadSalesLineItemFromDb}` +
      `'${value.id}' ` +
      `'${value.lineNumber}': ${reason}`;
  }
}

export class FailedToConvertSalesLineItemToDb implements ResultError {
  public stack: string;
  public name = SalesLineItemRepositoryError.FailedToConvertSalesLineItemToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: ISalesLineItemProps,
    public reason: string
  ) {
    this.message =
      `[${SalesLineItemRepositoryError.FailedToConvertSalesLineItemToDb}]` +
      `[${value.id}]` +
      `[${value.lineNumber}]: ${reason}`;
  }
}

@Injectable()
export class SalesLineItemRepository {
  private readonly logger: Logger = new Logger(SalesLineItemRepository.name);
  private async handle<T>(fn: () => T) {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
  constructor(private readonly _lineItems: MongoLineItemsRepository) {}

  public async load(id: string): Promise<SalesLineItem> {
    let doc = await this._lineItems.findById(id);
    if (doc) return SalesLineItem.load(doc);
    else throw new SalesLineItemNotFoundException(id);
  }
  public async save(agg: SalesLineItem): Promise<SalesLineItem> {
    let result: SalesLineItem = null;
    const props = agg.entity();

    if (props.id?.length) {
      result = await this.upsertById(agg);
    } else {
      result = await this.create(agg);
    }
    return result;
  }
  public async delete(id: string): Promise<void> {
    await this._lineItems.delete(id);
  }

  private async upsertById(agg: SalesLineItem): Promise<SalesLineItem> {
    let dbe = agg.entity();
    let updated = await this._lineItems.update(dbe);
    dbe = await this._lineItems.findById(updated.id);
    return SalesLineItem.load(dbe);
  }

  private async create(agg: SalesLineItem): Promise<SalesLineItem> {
    let dbe = agg.entity();
    let updated = await this._lineItems.create(dbe);
    dbe = await this._lineItems.findById(updated.id);
    return SalesLineItem.load(dbe);
  }

  private async persist(
    repo: any,
    dbe: MongoSalesLineItem
  ): Promise<Result<SalesLineItem>> {
    throw new NotImplementedException();
    // await repo.persistAndFlush(dbe);
  }

  private failedToSave(props: MongoSalesLineItem, err: any) {
    this.logger.error(err);
    return Result.fail<SalesLineItem>(
      new FailedToSaveError(
        {
          id: props.id,
          type: SalesLineItem.name,
          name: `${props.lineNumber}`,
        },
        err.message
      )
    );
  }
  private failedToCreate(props: MongoSalesLineItem, err: any) {
    this.logger.error(err);
    return Result.fail<SalesLineItem>(
      new FailedToCreateError(
        {
          id: props.id,
          type: SalesLineItem.name,
          name: `${props.lineNumber}`,
        },
        err.message
      )
    );
  }
}
