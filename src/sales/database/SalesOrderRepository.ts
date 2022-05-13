/**
 * SalesOrdersRepository should have methods for
 * - loading the SalesOrder Aggregate into memory
 * - persisting the SalesOrder Aggregate (and its CustomOptions, Variants, etc)
 */
import { Injectable, Logger, NotImplementedException } from "@nestjs/common";

import { FailedToCreateError, FailedToSaveError } from "@shared/database";
import { ResultError, Result } from "@shared/domain/Result";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";

import { MongoOrdersRepository } from "./mongo/repositories/MongoOrdersRepository";

import { ISalesOrderProps, SalesOrder, SalesOrderEvent } from "../domain";
import { MongoSalesOrder } from "./mongo";
import { compact } from "lodash";
import { MongoDomainEventRepository } from "./mongo/repositories/MongoDomainEventRepository";
import { MongoDomainEvent } from "./mongo/schemas/MongoDomainEvent";
import { EventEmitter2 } from "@nestjs/event-emitter";

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

const convertToDoc = (
  e: SalesOrderEvent<any>
): MongoDomainEvent & SalesOrderEvent<any> =>
  Object.assign(new MongoDomainEvent(), e);

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
    private readonly _events: MongoDomainEventRepository,
    private _bus: EventEmitter2
  ) {}

  public async load(id: string): Promise<SalesOrder> {
    let doc = await this._orders.findById(id);
    if (doc) return SalesOrder.load(doc);
    else throw new SalesOrderNotFoundException(id);
  }
  public async save(agg: SalesOrder): Promise<SalesOrder> {
    let dbe = agg.entity();

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
      lineItems: dbe.lineItems,
    };
    let doc = await this._orders.findByIdAndUpdateOrCreate(payload);

    await this.handleDomainEvents(agg);

    return SalesOrder.load(doc);
  }

  public async delete(id: string): Promise<void> {
    await this._orders.delete(id);
  }

  private async handleDomainEvents(agg: SalesOrder) {
    let events = agg.events;
    if (events.length) {
      const mongoEvents = events.map(convertToDoc);
      await this._events.insert(mongoEvents);
      events.forEach(($e) => {
        this.logger.debug(
          `${$e.eventName} for ${$e.aggregateType} ${$e.aggregateId}`
        );
        this._bus.emit($e.eventName, $e);
      });
    }
  }
}
