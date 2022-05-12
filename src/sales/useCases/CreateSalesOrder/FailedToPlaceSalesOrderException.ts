import { HttpStatus } from "@nestjs/common";
import moment from "moment";
import { CreateOrderDto } from "@sales/dto";
import { CreateSalesOrderDto } from "../../dto/CreateSalesOrderDto";
import { CreateSalesOrderError } from "./CreateSalesOrderError";
import { CreateSalesOrderException } from "./CreateSalesOrderException";

export class FailedToPlaceSalesOrderException extends CreateSalesOrderException {
  constructor(
    dto: CreateSalesOrderDto | CreateOrderDto,
    reason: any,
    type: CreateSalesOrderError = CreateSalesOrderError.UnknownSalesError,
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
