import { InternalServerErrorException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";
import moment from "moment";

/**
 * CSO ErrorTypes:
 * FailedToLoadVariant (conection failed, SKU or ID is invalid, etc)
 * InvalidLineItem (Personalization missing, invalid quantity, etc )
 * InvalidSalesOrder (Invalid AccountId/Name/Number/Date/LineItem(s)/Customer/ShippingAddress)
 * FailedToSaveSalesOrder (DbConnection failed)
 */
export enum PlaceOrderError {
  UnknownSalesError = "UnknownSalesError",
  SalesOrderValidationError = "SalesOrderValidationError",

  InvalidSalesOrder = "InvalidSalesOrder",
  InvalidLineItem = "InvalidLineItem",
  MissingLineItem = "MissingLineItem",
  FailedToSaveSalesOrder = "FailedToSaveSalesOrder",
  UserNotAuthorizedForAccount = "UserNotAuthorizedForAccount",
  AccountNotFound = "AccountNotFound",
  FailedToLoadVariantBySku = "FailedToLoadVariantBySku",
  FailedToLoadVariantById = "FailedToLoadVariantById",
}
export class PlaceOrderException extends InternalServerErrorException {
  public type: PlaceOrderError;
  constructor(objectOrError: any, description: string) {
    super(objectOrError, description);
  }
}
export class FailedToPlaceSalesOrderException extends PlaceOrderException {
  constructor(
    dto: any,
    reason: any,
    type: PlaceOrderError = PlaceOrderError.UnknownSalesError,
    inner: any[] = []
  ) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          `Failed to place SalesOrder for order ` +
          `'${dto.orderName}': ` +
          `${reason?.message || reason}`,
        timestamp: moment().toDate(),
        error: type,
        details: {
          orderName: dto.orderName,
          orderNumber: dto.orderNumber,
          reason,
          inner,
        },
      },
      `Failed to place SalesOrder for order ` +
        `'${dto.orderName}': ` +
        `${reason?.message || reason}`
    );
  }
}
export class SalesOrderValidationError {
  public type: PlaceOrderError =
    PlaceOrderError.SalesOrderValidationError;
  constructor(public property: string, public message: string) {}
}

export function generateValidationError(
  errors: ValidationError[],
  parent: string = null
) {
  return errors.reduce((finalErrors, err): SalesOrderValidationError[] => {
    let property = "";
    if (parent) {
      property = `${parent}`;
      if (parent != err.property) property = `${property}.`;
    }
    if (parent != err.property) property = `${property}${err.property}`;
    if (err.constraints) {
      const message = Object.values(err.constraints).join("; ");
      finalErrors.push(new SalesOrderValidationError(property, message));
    }

    if (err.children?.length) {
      const childErr = generateValidationError(err.children, property);
      finalErrors = finalErrors.concat(childErr);
    }

    return finalErrors;
  }, [] as SalesOrderValidationError[]);
}
