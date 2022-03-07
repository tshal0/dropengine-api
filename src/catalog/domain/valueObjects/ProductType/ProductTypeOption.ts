import { Result, ResultError, ValueObject } from "@shared/domain";

export interface IProductTypeVariantOption {
  [key: string]: any;
  name: string;
  value: string;
  enabled: boolean;
}

export interface IProductTypeOption {
  [key: string]: any;
  name: string;
  values: IProductTypeVariantOption[];
}

export enum ProductTypeOptionError {
  InvalidProductTypeOption = "InvalidProductTypeOption",
  ProductTypeOptionNameConflict = "ProductTypeOptionNameConflict",
  ProductTypeOptionNameMissing = "ProductTypeOptionNameMissing",
  ProductTypeOptionValuesMissing = "ProductTypeOptionValuesMissing",
}

export class InvalidProductTypeOption implements ResultError {
  public stack: string;
  public name = ProductTypeOptionError.InvalidProductTypeOption;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: string,
    public reason: string
  ) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class ProductTypeOptionNameConflict implements ResultError {
  public stack: string;
  public name = ProductTypeOptionError.ProductTypeOptionNameConflict;
  public message: string;
  public inner: ResultError[];
  constructor(public value: { parent: string; conflicts: string[] }) {
    let reason =
      `All ProductTypeOption names must match parent Name: '${value.parent}'. ` +
      `Conflicts: '${value.conflicts.join(",")}'`;
    this.message = `${this.name}: ${reason}`;
  }
}
export class ProductTypeOptionValuesMissing implements ResultError {
  public stack: string;
  public name = ProductTypeOptionError.ProductTypeOptionValuesMissing;
  public message: string;
  public inner: ResultError[];
  constructor() {
    let reason = `All ProductTypeOptions must have a non-empty set of 'values'.`;
    this.message = `${this.name}: ${reason}`;
  }
}
export class ProductTypeOptionNameMissing implements ResultError {
  public stack: string;
  public name = ProductTypeOptionError.ProductTypeOptionNameMissing;
  public message: string;
  public inner: ResultError[];

  constructor(public value: { name: string }) {
    let reason = `ProductType CustomOption must have a 'name'.`;
    this.message = `${this.name}: ${reason}`;
  }
}

export class ProductTypeOption extends ValueObject<IProductTypeOption> {
  static from(dto: IProductTypeOption): Result<ProductTypeOption> {
    let errors = [];

    if ([null, undefined].includes(dto)) {
      return Result.ok(new ProductTypeOption(null));
    }
    let conflicts =
      dto?.values?.filter((o) => o.name != dto?.name)?.map((o) => o.name) || [];
    if (conflicts.length) {
      errors.push(
        new ProductTypeOptionNameConflict({ parent: dto?.name, conflicts })
      );
    }
    if (!dto?.name?.length) {
      errors.push(new ProductTypeOptionNameMissing({ name: dto.name }));
    }
    if (!dto?.values?.length) {
      errors.push(new ProductTypeOptionValuesMissing());
    }
    if (errors.length) {
      return Result.fail(
        new InvalidProductTypeOption(
          errors,
          dto?.name,
          "Errors found while creating ProductTypeOption. See inner for details."
        )
      );
    }
    return Result.ok(new ProductTypeOption(dto));
  }
}
