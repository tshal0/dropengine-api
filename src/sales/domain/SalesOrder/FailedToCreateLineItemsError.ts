import { ResultError } from "@shared/domain";
import { SalesOrderError } from "./SalesOrderError";

export class FailedToCreateLineItemsError implements ResultError {
  public stack: string;
  public name = SalesOrderError.FailedToCreateLineItems;
  public value: any;

  public message: string;
  constructor(public inner: ResultError[], public reason: string) {
    this.message = `${this.name}: ${reason}`;
  }
}
