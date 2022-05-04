import { ResultError } from "@shared/domain";
import { SalesOrderError } from "./SalesOrderError";

export class InvalidSalesOrder implements ResultError {
  public stack: string;
  public name = SalesOrderError.InvalidSalesOrder;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: any,
    public reason: string
  ) {
    this.message = `${this.name} '${this.value.id}' '${this.value.name}': ${reason}`;
  }
}
