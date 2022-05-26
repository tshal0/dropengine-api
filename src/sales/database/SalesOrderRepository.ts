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

import { MongoSalesOrder } from "./mongo";
import { compact } from "lodash";
import { MongoDomainEventRepository } from "./mongo/repositories/MongoDomainEventRepository";
import { MongoDomainEvent } from "./mongo/schemas/MongoDomainEvent";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SalesOrderEvent } from "@sales/domain/events/SalesOrderEvent";
import { ISalesOrderProps, SalesOrder } from "@sales/domain";
import { MongoQueryParams } from "@shared/mongo";

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

  constructor(
    private readonly _orders: MongoOrdersRepository,
    private readonly _events: MongoDomainEventRepository,
    private _bus: EventEmitter2
  ) {}

  public async exists(id: string): Promise<boolean> {
    const result = await this._orders.query({ filter: { id } });
    return result != null;
  }
  public async existsWithName(name: string): Promise<boolean> {
    const result = await this._orders.query({ filter: { orderName: name } });
    return result != null;
  }
  public async load(id: string): Promise<SalesOrder> {
    let doc = await this._orders.findById(id);
    if (doc) return new SalesOrder(doc.raw());
    else throw new SalesOrderNotFoundException(id);
  }
  public async save(order: SalesOrder): Promise<SalesOrder> {
    let raw = order.raw();
    const payload: MongoSalesOrder = new MongoSalesOrder(raw);
    let doc = await this._orders.create(payload);
    await this.handleDomainEvents(order);
    return new SalesOrder(doc.raw());
  }

  public async delete(id: string): Promise<MongoSalesOrder> {
    return await this._orders.delete(id);
  }

  public async query(params: MongoQueryParams<MongoSalesOrder>) {
    let result = await this._orders.query(params);
    return result;
  }

  private async handleDomainEvents(agg: SalesOrder) {
    let events = [];
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
