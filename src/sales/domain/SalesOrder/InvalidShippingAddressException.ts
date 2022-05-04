import moment from "moment";
import { AddressDto } from "@sales/dto";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { SalesOrderError } from "./SalesOrderError";

export class InvalidShippingAddressException extends InternalServerErrorException {
  constructor(
    dto: {
      orderId: string;
      shippingAddress: AddressDto;
    },
    reason: any,
    type: SalesOrderError,
    inner: any[]
  ) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to update shipping address for order ` +
          `'${dto.orderId}': ` +
          `${reason}`,
        timestamp: moment().toDate(),
        error: type,
        details: {
          orderId: dto.orderId,
          shippingAddress: dto.shippingAddress,
          reason,
          inner,
        },
      },
      `Failed to update shipping address for order ` +
      `'${dto.orderId}': ` +
      `${reason}`
    );
  }
}
