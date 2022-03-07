import {
  ConflictException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError as NestValidationError,
} from "@nestjs/common";

export enum ApiError {
  UnknownError = "UnknownError",
  ValidationError = "ValidationError",
  ProductValidationError = "ProductValidationError",
  ProductModificationError = "ProductModificationError",
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
    public property: string
  ) {
    super(code, message);
  }
}
export class ProductValidationError extends ValidationError {
  public type: ApiError = ApiError.ProductValidationError;
  constructor(
    public code: string,
    public message: string,
    public property: string
  ) {
    super(code, message, property);
  }
}
export class ProductCreateException extends UnprocessableEntityException {
  constructor(error: string, details: any) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: "Unprocessable Entity",
      timestamp: new Date().toISOString(),
      error: error,
      details: details,
    } as ProductCreateException);
  }
  statusCode: number;
  error: string;
  details: ProductValidationError[];
  timestamp: string;
}
