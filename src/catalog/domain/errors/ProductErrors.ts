import { ResultError } from "@shared/domain";
import {
  ICustomOption,
  ICustomOptionProps,
} from "../valueObjects/CustomOption/CustomOption";

export enum Errors {
  UnknownError = "UnknownError",
  ProductValidationError = "ProductValidationError",
  ProductGenerationError = "ProductGenerationError",
  CustomOptionValidationError = "CustomOptionValidationError",
}

export enum ProductErrors {
  INVALID_CUSTOM_OPTIONS = "InvalidCustomOptions",
  INVALID_PRODUCT_VARIANTS = "InvalidProductVariants",
  INVALID_PRODUCTS = "InvalidProducts",
  INVALID_CUSTOM_OPTION = "InvalidCustomOption",
  INVALID_CREATE_PRODUCT_DTO = "InvalidCreateProductDto",
  INVALID_PRODUCT_SKU = "InvalidProductSku",
  PRODUCT_GENERATE_FAILED = "ProductGenerateFailed",
}

export class InvalidCustomOption implements ResultError {
  public stack: string;
  public name = ProductErrors.INVALID_CUSTOM_OPTION;
  public message: string;
  constructor(public inner: ResultError[], public value: ICustomOptionProps) {
    this.message = `Invalid CustomOption '${value.label}' was found.`;
  }
}
export class InvalidCustomOptions implements ResultError {
  public stack: string;
  public name = ProductErrors.INVALID_CUSTOM_OPTIONS;
  public message: string;
  constructor(public inner: ResultError[], public value: any) {
    this.message = `Invalid CustomOptions were found.`;
  }
}
export class InvalidProducts implements ResultError {
  public stack: string;
  public name = ProductErrors.INVALID_PRODUCTS;
  public message: string;
  constructor(public inner: ResultError[], public value: any) {
    this.message = `Invalid Products were found.`;
  }
}
export class InvalidProductVariants implements ResultError {
  public stack: string;
  public name = ProductErrors.INVALID_PRODUCT_VARIANTS;
  public message: string;
  constructor(public inner: ResultError[], public value: any) {
    this.message = `Invalid ProductVariants were found.`;
  }
}
export class ProductGenerateFailed implements ResultError {
  public stack: string;
  public name = ProductErrors.PRODUCT_GENERATE_FAILED;
  public message: string;
  constructor(public inner: ResultError[], public value: any) {
    this.message = `Product failed to generate from provided DTO.`;
  }
}
