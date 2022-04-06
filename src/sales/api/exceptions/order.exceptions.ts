import {
  ConflictException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError as NestValidationError,
} from '@nestjs/common';
export enum ApiError {
  UnknownError = 'UnknownError',
  ValidationError = 'ValidationError',
  OrderValidationError = 'OrderValidationError',
  OrderModificationError = 'OrderModificationError',
  OrderCancellationError = 'OrderCancellationError',
}
export class ApiErrorDto {
  public readonly type: ApiError = ApiError.UnknownError;
  constructor(public code: string, public message: string) {}
}
export class ValidationError extends ApiErrorDto {
  public readonly type: ApiError = ApiError.ValidationError;
  constructor(
    public code: string,
    public message: string,
    public property: string,
  ) {
    super(code, message);
  }
}
export class OrderValidationError extends ValidationError {
  public type: ApiError = ApiError.OrderValidationError;
  constructor(
    public code: string,
    public message: string,
    public property: string,
  ) {
    super(code, message, property);
  }
}
export class OrderModificationError extends ValidationError {
  public type: ApiError = ApiError.OrderModificationError;
  constructor(
    public code: string,
    public message: string,
    public property: string,
  ) {
    super(code, message, property);
  }
}

export class OrderModificationException extends ConflictException {
  constructor(error: string, details: any) {
    super({
      statusCode: HttpStatus.CONFLICT,
      message: 'Conflict',
      timestamp: new Date().toISOString(),
      error: error,
      details: details,
    } as OrderModificationException);
  }
  statusCode: number;
  error: string;
  details: OrderModificationError[];
  timestamp: string;
}

export class OrderCreateException extends UnprocessableEntityException {
  constructor(error: string, details: any) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Unprocessable Entity',
      timestamp: new Date().toISOString(),
      error: error,
      details: details,
    } as OrderCreateException);
  }
  statusCode: number;
  error: string;
  details: OrderValidationError[];
  timestamp: string;
}

export class OrderValidationException extends OrderCreateException {
  constructor(error: string, errors: OrderValidationError[]) {
    super(error || 'Order Validation Failed', errors);
  }
}

export class OrderCreateErrorResponseDto extends OrderCreateException {}

// export const OrderErrorCodes: { [key: string]: string } = {
//   order_id: 'invalid_order_id',
//   order_date: 'invalid_order_date',
//   order_number: 'invalid_order_number',
//   order_source: 'invalid_order_source',
//   customer_name: 'invalid_customer_name',
//   customer_email: 'invalid_customer_email',
//   store: 'invalid_store',
//   store_shop_origin: 'invalid_store_shop_origin',
//   store_email: 'invalid_store_email',
//   store_name: 'invalid_store_name',
//   shipping_address: 'invalid_shipping_address',
//   line_items: 'invalid_line_items',
//   line_items_sku: 'invalid_line_items_sku',
//   line_items_quantity: 'invalid_line_items_quantity',
//   line_items_properties: 'invalid_line_items_properties',
// };

export enum CreateOrderErrorCode {
  order_id = 'invalid_order_id',
  order_date = 'invalid_order_date',
  order_number = 'invalid_order_number',
  order_source = 'invalid_order_source',
  customer_name = 'invalid_customer_name',
  customer_email = 'invalid_customer_email',
  store = 'invalid_store',
  store_shop_origin = 'invalid_store_shop_origin',
  store_email = 'invalid_store_email',
  store_name = 'invalid_store_name',
  shipping_address = 'invalid_shipping_address',
  line_items = 'invalid_line_items',
  line_item_line_number = 'invalid_line_number',
  line_item_parts_already_designed = 'line_item_parts_already_designed',
  line_items_variant_sku = 'invalid_line_items_sku',
  line_items_quantity = 'invalid_line_items_quantity',
  line_items_line_item_properties = 'invalid_line_item_properties',
  line_items_line_item_properties_name = 'invalid_line_item_property_name',
  line_item_properties_name = 'invalid_line_item_property_name',
  line_item_properties_value = 'invalid_line_item_property_value',
  line_items_line_item_properties_value = 'invalid_line_item_property_value',
  shipping_address_address1 = 'invalid_shipping_address_address1',
  shipping_address_city = 'invalid_shipping_address_city',
  shipping_address_country = 'invalid_shipping_address_country',
  shipping_address_province = 'invalid_shipping_address_province',
  shipping_address_name = 'invalid_shipping_address_name',
  shipping_address_zip = 'invalid_shipping_address_zip',
  shipping_address_country_code = 'invalid_shipping_address_country_code',
  shipping_address_province_code = 'invalid_shipping_address_province_code',
}
export enum ModifyOrderErrorCode {
  line_item_parts_already_designed = 'line_item_parts_already_designed',
}

export const generateOrderValidationError = (
  errors: NestValidationError[],
  parent: string = null,
) => {
  return errors.reduce(
    (finalErrors, err: NestValidationError): OrderValidationError[] => {
      // Property is line_items, children is [{sku}, {line_item_properties}]
      let property = '';
      if (parent) {
        property = `${parent}.`;
      }
      property = `${property}${err.property}`;
      if (err.constraints) {
        const errorCodeKey = property?.replace(/([.][0-9][.]|[.])/g, '_');
        const code = CreateOrderErrorCode[errorCodeKey] || 'invalid_query';
        const message = Object.values(err.constraints).join('; ');
        finalErrors.push(new OrderValidationError(code, message, property));
      }

      if (err.children?.length) {
        const childErr = generateOrderValidationError(err.children, property);
        finalErrors = finalErrors.concat(childErr);
      }

      return finalErrors;
    },
    [] as OrderValidationError[],
  );
};
