import { Result, ResultError, ValueObject } from "@shared/domain";
import { JsonObject, JsonValue } from "@shared/modules";

export interface IProductTypeProductionData extends JsonObject {
  material: string;
  thickness: string;
  route: string;
}

export enum ProductTypeProductionDataError {
  InvalidProductionData = "InvalidProductionData",
  ProductTypeOptionNameConflict = "ProductTypeOptionNameConflict",
  ProductTypeOptionNameMissing = "ProductTypeOptionNameMissing",
  ProductTypeOptionValuesMissing = "ProductTypeOptionValuesMissing",
}

export class InvalidProductTypeProductionData implements ResultError {
  public stack: string;
  public name = ProductTypeProductionDataError.InvalidProductionData;
  public message: string;
  public inner: ResultError[];
  constructor() {
    this.message = `${this.name}: ProductType 'productionData' must not be null or undefined.`;
  }
}
export interface IProductTypeManufacturing extends IProductTypeProductionData {}
export class ProductTypeManufacturing extends ValueObject<IProductTypeManufacturing> {
  static from(
    value: IProductTypeProductionData
  ): Result<ProductTypeManufacturing> {
    if ([null, undefined].includes(value)) {
      return Result.fail(new InvalidProductTypeProductionData());
    }
    return Result.ok(new ProductTypeManufacturing(value));
  }
}
