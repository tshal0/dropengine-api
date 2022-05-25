import { ISalesCustomer, SalesCustomer } from "./SalesCustomer";
import { ISalesLineItemProps, SalesLineItem } from "./SalesLineItem";
import validator from "validator";
import { Address, IAddress } from "@shared/domain";
import moment, { isDate } from "moment";
import { OrderPlacedDetails, SalesOrderPlaced } from "../events/OrderPlaced";
import { SalesOrderEvent } from "../events/SalesOrderEvent";
import { SalesOrderCanceled } from "../events/OrderCanceled";
import { CustomerInfoChanged } from "../events/CustomerInfoChanged";
import { IPersonalization, Personalization } from "./Personalization";
import { PersonalizationChanged } from "../events/PersonalizationChanged";
import { ShippingAddressChanged } from "../events/ShippingAddressChanged";

export enum OrderStatus {
  OPEN = "OPEN",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
  FULFILLED = "FULFILLED",
  ARCHIVED = "ARCHIVED",
}

export interface ISalesOrderProps {
  id: string;
  accountId: string;
  orderName: string;
  orderNumber: number;
  orderDate: Date;
  orderStatus: OrderStatus;
  lineItems: ISalesLineItemProps[];
  customer: ISalesCustomer;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  events: SalesOrderEvent<any>[];
  updatedAt: Date;
  createdAt: Date;
}

export interface ISalesOrder {
  id: string;
  accountId: string;
  orderName: string;
  orderNumber: number;
  orderDate: Date;
  orderStatus: OrderStatus;
  lineItems: SalesLineItem[];
  customer: SalesCustomer;
  shippingAddress: Address;
  billingAddress: Address;
  updatedAt: Date;
  createdAt: Date;
}
export class SalesOrder implements ISalesOrder {
  private _id: string = null;
  private _accountId: string = null;
  private _orderName: string = "";
  private _orderNumber: number = 0;
  private _orderDate: Date = moment().toDate();
  private _orderStatus: OrderStatus = OrderStatus.OPEN;
  private _lineItems: SalesLineItem[] = [];
  private _customer: SalesCustomer = new SalesCustomer();
  private _shippingAddress: Address = new Address();
  private _billingAddress: Address = new Address();
  private _updatedAt: Date = moment().toDate();
  private _createdAt: Date = moment().toDate();
  private _events: SalesOrderEvent<any>[] = [];
  constructor(props?: ISalesOrderProps | undefined) {
    if (props) {
      this._id = validator.isMongoId(`${props.id}`) ? props.id : null;
      this._accountId = validator.isUUID(`${props.accountId}`)
        ? props.accountId
        : null;
      this._orderName = props.orderName;
      this._orderNumber = props.orderNumber;
      this._orderDate = isDate(props.orderDate)
        ? new Date(props.orderDate)
        : null;
      this._orderStatus = props.orderStatus;
      this._lineItems = props.lineItems.map((li) => new SalesLineItem(li));
      this._customer = new SalesCustomer(props.customer);
      this._shippingAddress = new Address(props.shippingAddress);
      this._billingAddress = new Address(props.billingAddress);
      this._updatedAt = props.updatedAt;
      this._createdAt = props.createdAt;
    }
  }

  /** DOMAIN METHODS */
  public raise(event: SalesOrderEvent<any>) {
    this._events.push(event);
    return this;
  }
  public placed(details: OrderPlacedDetails) {
    this.accountId = details.accountId;
    this.orderName = details.orderName;
    this.orderNumber = details.orderNumber;
    this.orderDate = details.orderDate;
    this.orderStatus = OrderStatus.OPEN;
    this.lineItems = details.lineItems.map(
      (li) =>
        new SalesLineItem({
          flags: [],
          lineNumber: li.lineNumber,
          personalization: li.properties,
          quantity: li.quantity,
          variant: li.variant,
        })
    );
    this.customer = new SalesCustomer(details.customer);
    this.shippingAddress = new Address(details.shippingAddress);
    this.billingAddress = new Address(details.billingAddress);
    let event = new SalesOrderPlaced(null, details);
    this.raise(event);
    return event;
  }
  public cancel(dto: {
    canceledAt: Date;
    requestedBy: { name: string; email: string };
  }) {
    this.orderStatus = OrderStatus.CANCELED;
    let event = new SalesOrderCanceled(this.id, {
      canceledAt: dto.canceledAt,
      requestedBy: dto.requestedBy,
    });
    this.raise(event);
    return event;
  }
  public editCustomer(dto: { name: string; email: string }) {
    this.customer = new SalesCustomer({ email: dto.email, name: dto.name });
    let event = new CustomerInfoChanged(this.id, { customer: dto });
    this.raise(event);
    return event;
  }
  public editPersonalization(dto: {
    lineNumber: number;
    personalization: IPersonalization[];
  }) {
    let lineItem = this.lineItems.find((li) => li.lineNumber == dto.lineNumber);
    lineItem.personalization = dto.personalization.map(
      (p) => new Personalization(p)
    );
    let event = new PersonalizationChanged(this.id, {
      lineNumber: dto.lineNumber,
      personalization: dto.personalization,
    });
    this.raise(event);
    return event;
  }
  public editShippingAddress(dto: { address: IAddress }) {
    this.shippingAddress = new Address(dto.address);
    let event = new ShippingAddressChanged(this.id, {
      address: { ...dto.address },
    });
    this.raise(event);
    return event;
  }

  /** UTILITY METHODS */
  public raw(): ISalesOrderProps {
    return {
      id: this._id,
      accountId: this._accountId,
      orderName: this._orderName,
      orderNumber: this._orderNumber,
      orderDate: this._orderDate,
      orderStatus: this._orderStatus,
      lineItems: this._lineItems.map((li) => li.raw()),
      customer: this._customer.raw(),
      shippingAddress: this._shippingAddress.raw(),
      billingAddress: this._billingAddress.raw(),
      updatedAt: this._updatedAt,
      createdAt: this._createdAt,
      events: this._events,
    };
  }

  /** GET/SET */

  public get events() {
    return this._events;
  }
  public set id(val: any) {
    this._id = validator.isMongoId(`${val}`) ? val : null;
  }
  public get id() {
    return this._id;
  }
  public set accountId(val: any) {
    this._accountId = validator.isUUID(`${val}`) ? val : null;
  }
  public get accountId(): string {
    return this._accountId;
  }
  public set orderName(val: any) {
    this._orderName = val;
  }
  public get orderName(): string {
    return this._orderName;
  }
  public set orderNumber(val: any) {
    this._orderNumber = val;
  }
  public get orderNumber(): number {
    return this._orderNumber;
  }
  public set orderDate(val: any) {
    this._orderDate = isDate(val) ? new Date(val) : null;
  }
  public get orderDate(): Date | null {
    return this._orderDate;
  }
  public set orderStatus(val: any) {
    this._orderStatus = val;
  }
  public get orderStatus(): OrderStatus {
    return this._orderStatus;
  }
  public set lineItems(val: SalesLineItem[]) {
    this._lineItems = val.map((v) => new SalesLineItem(v));
  }
  public get lineItems(): SalesLineItem[] {
    return this._lineItems;
  }
  public set customer(val: any) {
    this._customer = val;
  }
  public get customer(): SalesCustomer {
    return this._customer;
  }
  public set shippingAddress(val: any) {
    this._shippingAddress = val;
  }
  public get shippingAddress(): Address {
    return this._shippingAddress;
  }
  public set billingAddress(val: any) {
    this._billingAddress = val;
  }
  public get billingAddress(): Address {
    return this._billingAddress;
  }
  public set updatedAt(val: any) {
    this._updatedAt = val;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }
  public set createdAt(val: any) {
    this._createdAt = val;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
}
