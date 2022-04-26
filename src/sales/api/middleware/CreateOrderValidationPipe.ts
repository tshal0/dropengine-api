import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
  HttpStatus,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AzureTelemetryService } from "@shared/modules";
import {
  generateOrderValidationError,
  OrderValidationException,
} from "../exceptions";

@Injectable()
export class CreateOrderValidationPipe implements PipeTransform {
  constructor(private readonly logger: AzureTelemetryService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let orderValidationErrors = generateOrderValidationError(errors);
      throw new OrderValidationException(
        "Order Validation Failed",
        orderValidationErrors
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
