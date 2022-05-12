import { CreateSalesOrderError } from "./CreateSalesOrderError";

export class SalesOrderValidationError {
  public type: CreateSalesOrderError = CreateSalesOrderError.SalesOrderValidationError;
  constructor(public property: string, public message: string) { }
}
