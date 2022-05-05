/**
 * SalesOrdersRepository should have methods for
 * - loading the SalesOrder Aggregate into memory
 * - persisting the SalesOrder Aggregate (and its CustomOptions, Variants, etc)
 */
import { Injectable, Logger, NotImplementedException } from "@nestjs/common";

import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { ResultError, Result } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { MongoSalesOrder } from "./mongo/MongoSalesOrder";

import { MongoOrdersRepository } from "./mongo/MongoSalesOrderRepository";

import { ISalesOrderProps, SalesOrder } from "../domain";
import { MongoLineItemsRepository } from "./mongo/MongoLineItemRepository";

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
  private readonly logger: Logger = new Logger(SalesOrderRepository.name);
  private async handle<T>(fn: () => T) {
    try {
      return await fn();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
  constructor(
    private readonly _orders: MongoOrdersRepository,
    private readonly _lineItems: MongoLineItemsRepository
  ) {}

  public async load(id: string): Promise<SalesOrder> {
    let doc = await this._orders.findById(id);
    if (doc) return SalesOrder.load(doc);
    else throw new SalesOrderNotFoundException(id);
  }
  public async save(agg: SalesOrder): Promise<SalesOrder> {
    let result: SalesOrder = null;
    const props = agg.entity();

    if (props.id?.length) {
      result = await this.upsertById(agg);
    } else {
      result = await this.create(agg);
    }
    return result;
  }
  public async delete(id: string): Promise<void> {
    await this._orders.delete(id);
  }

  private async upsertById(agg: SalesOrder): Promise<SalesOrder> {
    let dbe = agg.entity();
    const lineItems = await Promise.all(
      dbe.lineItems.map(async (li) => this._lineItems.create(li))
    );
    const identifiers = lineItems.map((li) => li.id);
    const payload: MongoSalesOrder = {
      accountId: dbe.accountId,
      orderName: dbe.orderName,
      orderStatus: dbe.orderStatus,
      orderDate: dbe.orderDate,
      orderNumber: dbe.orderNumber,
      customer: dbe.customer,
      shippingAddress: dbe.shippingAddress,
      billingAddress: dbe.billingAddress,
      updatedAt: dbe.updatedAt,
      createdAt: dbe.createdAt,
      id: dbe.id,
      lineItems: identifiers as any, // Hack
    };
    let updated = await this._orders.update(payload);
    dbe = await this._orders.findById(updated.id);
    return SalesOrder.load(dbe);
  }

  private async create(agg: SalesOrder): Promise<SalesOrder> {
    let dbe = agg.entity();

    const lineItems = await Promise.all(
      dbe.lineItems.map(async (li) => this._lineItems.create(li))
    );
    const identifiers = lineItems.map((li) => li.id);
    if (!identifiers.length) {
      this.logger.warn(`CreateSalesOrder:LineItemsNotFound`);
    }
    let updated = await this._orders.create({
      ...dbe,
      lineItems: identifiers as any, // Hack
    });
    dbe = await this._orders.findById(updated.id);
    return await SalesOrder.load(dbe);
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
