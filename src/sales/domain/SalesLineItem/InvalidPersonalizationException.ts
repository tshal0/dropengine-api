import moment from "moment";
import { ILineItemProperty } from "../ValueObjects/ILineItemProperty";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { OrderFlag } from "../ValueObjects";
import { SalesLineItemError } from "./SalesLineItem";


export class InvalidPersonalizationException extends InternalServerErrorException {
  constructor(
    dto: {
      lineItemId: string;
      personalization: ILineItemProperty[];
      flags: OrderFlag[];
    },
    reason: any,
    type: SalesLineItemError,
    inner: any[]
  ) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to update personalization for line item ` +
          `'${dto.lineItemId}': ` +
          `${reason}`,
        timestamp: moment().toDate(),
        error: type,
        details: {
          lineItemId: dto.lineItemId,
          personalization: dto.personalization,
          reason,
          inner,
        },
      },
      `Failed to update personalization for line item ` +
      `'${dto.lineItemId}': ` +
      `${reason}`
    );
  }
}
