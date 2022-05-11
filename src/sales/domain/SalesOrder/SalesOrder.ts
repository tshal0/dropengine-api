import moment from "moment";
import { ResultError, IAggregate, Result } from "@shared/domain";
import { ISalesOrder, ISalesOrderProps } from "./ISalesOrder";
import { CreateOrderDto } from "@sales/dto";
import { AccountId } from "@auth/domain/valueObjects/AccountId";
import { EditShippingAddressDto } from "@sales/api";
import { SalesLineItem } from "../SalesLineItem";
import {
  SalesOrderAddress,
  SalesOrderNumber,
  SalesOrderDate,
  SalesOrderStatus,
  OrderStatus,
  SalesOrderCustomer,
  SalesOrderID,
} from "../ValueObjects";
import { FailedToLoadLineItemsError } from "./FailedToLoadLineItemsError";
import { FailedToCreateLineItemsError } from "./FailedToCreateLineItemsError";
import { InvalidSalesOrder } from "./InvalidSalesOrder";
import { SalesOrderError } from "./SalesOrderError";
import { InvalidShippingAddressException } from "./InvalidShippingAddressException";
import { MongoSalesLineItem } from "@sales/database/mongo/MongoSalesLineItem";
import { MongoSalesOrder } from "@sales/database/mongo/MongoSalesOrder";
import { Types } from "mongoose";

export class SalesOrder extends IAggregate<
  ISalesOrderProps,
  ISalesOrder,
  MongoSalesOrder
> {
  protected _events: any[];
  private constructor(props: ISalesOrder, doc: MongoSalesOrder) {
    super(props, doc);
  }
  public get id(): string {
    return this._entity.id;
  }

  /**
   * Returns the database entity.
   * @returns {ISalesOrderProps}
   */
  public entity(): MongoSalesOrder {
    const value: MongoSalesOrder = this._entity;

    return Object.seal(value);
  }
  /**
   * Returns the raw props.
   * @returns {ISalesOrderProps}
   */
  public props(maxDepth?: number | undefined): ISalesOrderProps {
    const lineItems = this._value.lineItems.map((li) => li.props());
    const identifiers: any = this._entity.lineItems.map((li) =>
      li instanceof Types.ObjectId ? li : li.id
    );
    const props: ISalesOrderProps = {
      id: this._value.id.value() || this._entity.id,
      accountId: this._value.accountId.value(),
      orderName: this._value.orderName,
      orderNumber: this._value.orderNumber.value(),
      orderDate: this._value.orderDate.value(),
      orderStatus: this._value.orderStatus.value(),
      lineItems: lineItems.length ? lineItems : identifiers,
      customer: this._value.customer.value(),
      shippingAddress: this._value.shippingAddress.value(),
      billingAddress: this._value.billingAddress.value(),
      createdAt: this._value.createdAt,
      updatedAt: this._value.updatedAt,
    };
    return props;
  }

  /**
   * Returns the raw props.
   * @returns {ISalesOrderProps}
   */
  public value(): ISalesOrder {
    return Object.seal(this._value);
  }

  /** Domain Actions */

  public async updateShippingAddress(
    dto: EditShippingAddressDto
  ): Promise<SalesOrder> {
    const result = await SalesOrderAddress.from(dto.shippingAddress);
    if (result.isFailure) {
      throw new InvalidShippingAddressException(
        {
          orderId: this._entity.id,
          shippingAddress: dto.shippingAddress,
        },
        result.error.message,
        SalesOrderError.InvalidShippingAddress,
        result.error.inner
      );
    }
    this._entity.shippingAddress = dto.shippingAddress;
    this._value.shippingAddress = result.value();
    return this;
  }

  /** Utility Methods */

  /**
   * Creates a SalesOrder from a DTO, or returns Result with errors.
   * @param dto Data Transfer Object representing a SalesOrder to be created.
   * @returns {Result<SalesOrder>}
   */
  public static async create(dto: CreateOrderDto): Promise<SalesOrder> {
    //TODO: ValidateLineItems
    let results: { [key: string]: Result<any> } = {};
    results.number = SalesOrderNumber.from(dto.orderNumber);
    results.orderDate = SalesOrderDate.from(dto.orderDate);
    results.status = SalesOrderStatus.from(OrderStatus.OPEN);
    results.customer = await SalesOrderCustomer.from(dto.customer);
    results.shippingAddress = await SalesOrderAddress.from(dto.shippingAddress);
    results.billingAddress = await SalesOrderAddress.from(dto.billingAddress);

    results.accountId = AccountId.from(dto.accountId);

    const lineItems = await Promise.all(
      dto.lineItems.map(async (li) => {
        return SalesLineItem.create(li);
      })
    );
    if (!lineItems.length) {
      console.warn(`CreateSalesOrderError:LineItemsNotFound`);
    }
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      throw SalesOrder.invalidSalesOrder(errors, dto);
    }
    // Timestamp
    const now = moment().toDate();
    const orderNumber = results.number.value();
    const value: ISalesOrder = {
      id: SalesOrderID.from(null).value(),
      accountId: results.accountId.value(),
      orderName: dto.orderName,
      orderNumber: orderNumber,
      orderStatus: results.status.value(),
      customer: results.customer.value(),
      shippingAddress: results.shippingAddress.value(),
      billingAddress: results.billingAddress.value(),
      updatedAt: now,
      createdAt: now,
      orderDate: results.orderDate.value(),
      lineItems: lineItems,
    };

    // DBEntity
    const doc: MongoSalesOrder = new MongoSalesOrder();
    doc.accountId = value.accountId.value();
    doc.orderNumber = value.orderNumber.value();
    doc.orderName = value.orderName;
    doc.orderStatus = value.orderStatus.value();
    doc.lineItems = value.lineItems.map((li) => li.entity());
    doc.customer = value.customer.value();
    doc.shippingAddress = value.shippingAddress.value();
    doc.billingAddress = value.billingAddress.value();
    doc.updatedAt = value.updatedAt;
    doc.createdAt = value.createdAt;
    doc.orderDate = value.orderDate.value();
    doc.orderName = value.orderName;
    // SalesOrder
    const aggregate = new SalesOrder(value, doc);

    return aggregate;
  }

  public static async load(doc: MongoSalesOrder): Promise<SalesOrder> {
    let results: { [key: string]: Result<any> } = {};
    results.number = SalesOrderNumber.from(doc.orderNumber);
    results.orderDate = SalesOrderDate.from(doc.orderDate);
    results.accountId = AccountId.from(doc.accountId);
    results.status = SalesOrderStatus.from(doc.orderStatus);
    results.customer = await SalesOrderCustomer.from(doc.customer);
    results.shippingAddress = await SalesOrderAddress.from(doc.shippingAddress);
    results.billingAddress = await SalesOrderAddress.from(doc.billingAddress);
    // Errors
    const lineItems = doc.lineItems
      .filter((li) => !(li instanceof Types.ObjectId))
      .map((li) => {
        return SalesLineItem.load(li);
      });

    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      throw SalesOrder.failedToLoadSalesOrder(errors, doc);
    }

    const orderNumber = results.number.value();
    const props: ISalesOrder = {
      id: SalesOrderID.from(doc._id).value(),
      accountId: results.accountId.value(),
      orderNumber: orderNumber,
      orderName: doc.orderName,
      orderStatus: results.status.value(),
      customer: results.customer.value(),
      shippingAddress: results.shippingAddress.value(),
      billingAddress: results.billingAddress.value(),
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
      orderDate: results.orderDate.value(),
      lineItems: lineItems,
    };
    const value = new SalesOrder(props, doc);
    return value;
  }

  /** ERROR METHODS */

  private static invalidSalesOrder(
    errors: ResultError[],
    dto: CreateOrderDto
  ): ResultError {
    return new InvalidSalesOrder(
      errors,
      { ...dto },
      `Failed to create SalesOrder. See inner for details.`
    );
  }

  private static failedToLoadSalesOrder(
    errors: ResultError[],
    doc: MongoSalesOrder
  ): ResultError {
    return new InvalidSalesOrder(
      errors,
      { ...doc },
      `Failed to load SalesOrder from Mongo. See inner for details.`
    );
  }
}
