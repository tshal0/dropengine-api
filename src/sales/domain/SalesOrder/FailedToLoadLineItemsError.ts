import { ResultError } from "@shared/domain";
import { SalesOrderError } from "./SalesOrderError";

export class FailedToLoadLineItemsError implements ResultError {
  public stack: string;
  public name = SalesOrderError.FailedToLoadLineItems;
  public message: string;
  public value: any;
  constructor(public inner: ResultError[], public reason: string) {
    this.message = `${this.name}: ${reason}`;
  }
}
