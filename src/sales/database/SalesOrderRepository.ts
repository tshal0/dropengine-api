/**
 * SalesOrdersRepository should have methods for
 * - loading the SalesOrder Aggregate into memory
 * - persisting the SalesOrder Aggregate (and its CustomOptions, Variants, etc)
 */
import { Injectable, NotImplementedException } from "@nestjs/common";
import moment from "moment";

import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { ResultError, Result } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureTelemetryService } from "@shared/modules";
import { MongoSalesOrder } from "./mongo/MongoSalesOrder";

import { MongoOrdersRepository } from "./mongo/MongoSalesOrderRepository";

import { ISalesOrderProps, SalesOrder } from "../domain";

export class SalesOrderNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`SalesOrder not found with ID: ${id}`, id, `SALES_ORDER_NOT_FOUND`);
  }
}
export class SalesOrderNotFoundWithOrderNumberException extends EntityNotFoundException {
  constructor(id: string) {
    super(
      `SalesOrder not found with OrderNumber: ${id}`,
      id,
      `SALES_ORDER_NOT_FOUND`
    );
  }
}

export enum SalesOrderRepositoryError {
  FailedToLoadSalesOrderFromDb = "FailedToLoadSalesOrderFromDb",
  FailedToConvertSalesOrderToDb = "FailedToConvertSalesOrderToDb",
  SalesOrderNotFound = "SalesOrderNotFound",
}
export class SalesOrderNotFoundError implements ResultError {
  public stack: string;
  public name = SalesOrderRepositoryError.SalesOrderNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class FailedToLoadSalesOrderFromDb implements ResultError {
  public stack: string;
  public name = SalesOrderRepositoryError.FailedToLoadSalesOrderFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: MongoSalesOrder,
    public reason: string
  ) {
    this.message =
      `${SalesOrderRepositoryError.FailedToLoadSalesOrderFromDb}` +
      `'${value.id}' ` +
      `'${value.orderName}': ${reason}`;
  }
}

export class FailedToConvertSalesOrderToDb implements ResultError {
  public stack: string;
  public name = SalesOrderRepositoryError.FailedToConvertSalesOrderToDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: ISalesOrderProps,
    public reason: string
  ) {
    this.message =
      `[${SalesOrderRepositoryError.FailedToConvertSalesOrderToDb}]` +
      `[${value.id}]` +
      `[${value.orderName}]: ${reason}`;
  }
}

@Injectable()
export class SalesOrderRepository {
  constructor(
    private readonly logger: AzureTelemetryService,
    private readonly _mongo: MongoOrdersRepository
  ) {}
  protected static llog = () => `[${moment()}][${SalesOrderRepository.name}]`;

  public async load(id: string): Promise<Result<SalesOrder>> {
    try {
      let doc = await this._mongo.findById(id);
      if (doc) return SalesOrder.load(doc);
      return Result.fail(
        new SalesOrderNotFoundError(id, `Database returned null.`)
      );
    } catch (error) {
      return Result.fail(error);
    }
  }
  public async save(agg: SalesOrder): Promise<Result<SalesOrder>> {
    let result: Result<SalesOrder> = null;
    const props = agg.entity();
    try {
      if (props.id?.length) {
        result = await this.upsertById(agg);
      } else {
        result = await this.create(agg);
      }
      return result;
    } catch (err) {
      this.logger.debug(err);
      return this.failedToSave(props, err);
    }
  }
  public async delete(id: string): Promise<Result<void>> {
    try {
      await this._mongo.delete(id);
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  private async upsertById(agg: SalesOrder): Promise<Result<SalesOrder>> {
    try {
      let dbe = agg.entity();
      let updated = await this._mongo.update(dbe);
      return SalesOrder.load(updated);
    } catch (err) {
      return this.failedToSave(agg.entity(), err);
    }
  }

  private async create(agg: SalesOrder): Promise<Result<SalesOrder>> {
    try {
      let dbe = agg.entity();
      let updated = await this._mongo.create(dbe);
      return SalesOrder.load(updated);
    } catch (err) {
      return this.failedToCreate(agg.entity(), err);
    }
  }

  private async persist(
    repo: any,
    dbe: MongoSalesOrder
  ): Promise<Result<SalesOrder>> {
    throw new NotImplementedException();
    // await repo.persistAndFlush(dbe);
  }

  private failedToSave(props: MongoSalesOrder, err: any) {
    this.logger.error(err);
    return Result.fail<SalesOrder>(
      new FailedToSaveError(
        {
          id: props.id,
          type: SalesOrder.name,
          name: props.orderName,
        },
        err.message
      )
    );
  }
  private failedToCreate(props: MongoSalesOrder, err: any) {
    this.logger.error(err);
    return Result.fail<SalesOrder>(
      new FailedToCreateError(
        {
          id: props.id,
          type: SalesOrder.name,
          name: props.orderName,
        },
        err.message
      )
    );
  }
}
