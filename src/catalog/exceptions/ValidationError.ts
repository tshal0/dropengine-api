import {
  UnprocessableEntityException,
  HttpStatus,
} from "@nestjs/common";
import moment from "moment";

export enum ApiError {
  UnknownError = "UnknownError",
  ValidationError = "ValidationError",
  VariantQueryValidationError = "VariantQueryValidationError",
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
export class VariantQueryValidationError extends ValidationError {
  public type: ApiError = ApiError.VariantQueryValidationError;
  constructor(
    public code: string,
    public message: string,
    public property: string
  ) {
    super(code, message, property);
  }
}
export enum CreateVariantQueryErrorCode {
  productType = "InvalidProductType",
}

export class VariantQueryCreateException extends UnprocessableEntityException {
  constructor(error: string, details: any) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: "Unprocessable Entity",
      timestamp: `${moment()}`,
      error: error,
      details: details,
    } as VariantQueryCreateException);
  }
  statusCode: number;
  error: string;
  details: VariantQueryValidationError[];
  timestamp: string;
}
export class VariantQueryValidationException extends VariantQueryCreateException {
  constructor(error: string, errors: VariantQueryValidationError[]) {
    super(error || "VariantQueryValidationFailed", errors);
  }
}
