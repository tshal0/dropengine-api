import { InternalServerErrorException } from "@nestjs/common";
import { CreateSalesOrderError } from "./CreateSalesOrderError";

export class CreateSalesOrderException extends InternalServerErrorException {
  public type: CreateSalesOrderError;
  constructor(objectOrError: any, description: string) {
    super(objectOrError, description);
  }
}
