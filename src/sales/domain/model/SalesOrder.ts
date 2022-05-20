import { OrderResponseDto } from "@sales/api";
import { ISalesCustomer, SalesCustomer } from "./SalesCustomer";
import {
  ISalesLineItem,
  ISalesLineItemProps,
  SalesLineItem,
} from "./SalesLineItem";
import validator from "validator";
import { Address, IAddress } from "@shared/domain";
import { isDate } from "moment";
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
  private _orderDate: Date = new Date("2021-01-01T00:00:00.000Z");
  private _orderStatus: OrderStatus = OrderStatus.OPEN;
  private _lineItems: SalesLineItem[] = [];
  private _customer: SalesCustomer = new SalesCustomer();
  private _shippingAddress: Address = new Address();
  private _billingAddress: Address = new Address();
  private _updatedAt: Date = new Date("2021-01-01T00:00:00.000Z");
  private _createdAt: Date = new Date("2021-01-01T00:00:00.000Z");

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
    };
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
  public get accountId() {
    return this._accountId;
  }
  public set orderName(val: any) {
    this._orderName = val;
  }
  public get orderName() {
    return this._orderName;
  }
  public set orderNumber(val: any) {
    this._orderNumber = val;
  }
  public get orderNumber() {
    return this._orderNumber;
  }
  public set orderDate(val: any) {
    this._orderDate = isDate(val) ? new Date(val) : null;
  }
  public get orderDate() {
    return this._orderDate;
  }
  public set orderStatus(val: any) {
    this._orderStatus = val;
  }
  public get orderStatus() {
    return this._orderStatus;
  }
  public set lineItems(val: SalesLineItem[]) {
    this._lineItems = val.map((v) => new SalesLineItem(v));
  }
  public get lineItems() {
    return this._lineItems;
  }
  public set customer(val: any) {
    this._customer = val;
  }
  public get customer() {
    return this._customer;
  }
  public set shippingAddress(val: any) {
    this._shippingAddress = val;
  }
  public get shippingAddress() {
    return this._shippingAddress;
  }
  public set billingAddress(val: any) {
    this._billingAddress = val;
  }
  public get billingAddress() {
    return this._billingAddress;
  }
  public set updatedAt(val: any) {
    this._updatedAt = val;
  }
  public get updatedAt() {
    return this._updatedAt;
  }
  public set createdAt(val: any) {
    this._createdAt = val;
  }
  public get createdAt() {
    return this._createdAt;
  }
}
