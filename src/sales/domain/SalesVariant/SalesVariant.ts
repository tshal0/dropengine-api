import { IAggregate, Money, Result, ResultError, Weight } from "@shared/domain";
import { MongoSalesVariant } from "@sales/database";
import { CatalogVariant } from "@catalog/services";
import { ISalesVariantProps, ISalesVariant } from "./ISalesVariant";
import { SalesPersonalizationRule } from "./SalesPersonalizationRule";
import { SalesVariantOption } from "./SalesVariantOption";
import { isNull } from "lodash";

export enum SalesVariantError {
  InvalidSalesVariant = "InvalidSalesVariant",
}
export class InvalidSalesVariant implements ResultError {
  public stack: string;
  public name = SalesVariantError.InvalidSalesVariant;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: any,
    public reason: string
  ) {
    this.message = `${this.name} '${this.value?.id}' '${this.value?.sku}': ${reason}`;
  }
}

export class SalesVariant extends IAggregate<
  ISalesVariantProps,
  ISalesVariant,
  MongoSalesVariant
> {
  private constructor(val: ISalesVariant, doc: MongoSalesVariant) {
    super(val, doc);
  }

  public props(): ISalesVariantProps {
    let props: ISalesVariantProps = {
      id: this._value.id,
      sku: this._value.sku,
      image: this._value.image,
      svg: this._value.svg,
      type: this._value.type,
      option1: this._value.option1.value(),
      option2: this._value.option2.value(),
      option3: this._value.option3.value(),
      manufacturingCost: this._value.manufacturingCost.value(),
      shippingCost: this._value.shippingCost.value(),
      weight: this._value.weight.value(),
      productionData: this._value.productionData,
      personalizationRules: this._value.personalizationRules.map((r) =>
        r.value()
      ),
    };
    return props;
  }
  public entity(): MongoSalesVariant {
    return Object.seal(this._entity);
  }
  public value(): ISalesVariant {
    return Object.seal(this._value);
  }
  public static create(dto: CatalogVariant): Result<SalesVariant> {
    if (dto === null || dto === undefined)
      return Result.fail(SalesVariant.nullCatalogVariant());
    let results: { [key: string]: Result<any> } = {};
    results.option1 = SalesVariantOption.from(dto.option1);
    results.option2 = SalesVariantOption.from(dto.option2);
    results.option3 = SalesVariantOption.from(dto.option3);
    results.manufacturingCost = Money.from(dto.manufacturingCost);
    results.shippingCost = Money.from(dto.shippingCost);
    results.weight = Weight.from(dto.weight);
    results.personalizationRules = SalesVariant.createPersonalizationRules(dto);
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(SalesVariant.invalidSalesVariant(errors, dto));
    }
    const value: ISalesVariant = {
      id: dto.id,
      sku: dto.sku,
      image: dto.image,
      svg: dto.svg,
      type: dto.type,
      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      manufacturingCost: results.manufacturingCost.value(),
      shippingCost: results.shippingCost.value(),
      weight: results.weight.value(),
      productionData: dto.productionData,
      personalizationRules: results.personalizationRules.value(),
    };
    const doc = new MongoSalesVariant();
    doc.id = value.id;
    doc.sku = value.sku;
    doc.image = value.image;
    doc.svg = value.svg;
    doc.type = value.type;
    doc.option1 = value.option1.value();
    doc.option2 = value.option2.value();
    doc.option3 = value.option3.value();
    doc.manufacturingCost = value.manufacturingCost.value();
    doc.shippingCost = value.shippingCost.value();
    doc.weight = value.weight.value();
    doc.productionData = value.productionData;
    doc.personalizationRules = value.personalizationRules.map((r) => r.value());
    const variant = new SalesVariant(value, doc);
    return Result.ok(variant);
  }

  public static db(doc: MongoSalesVariant): Result<SalesVariant> {
    if (isNull(doc)) return Result.fail(SalesVariant.nullDocument(doc));
    let results: { [key: string]: Result<any> } = {};
    results.option1 = SalesVariantOption.from(doc.option1);
    results.option2 = SalesVariantOption.from(doc.option2);
    results.option3 = SalesVariantOption.from(doc.option3);
    results.manufacturingCost = Money.from(doc.manufacturingCost);
    results.shippingCost = Money.from(doc.shippingCost);
    results.weight = Weight.from(doc.weight);
    results.personalizationRules = SalesVariant.loadPersonalizationRules(doc);
    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(SalesVariant.failedToLoadSalesVariant(errors, doc));
    }
    const value: ISalesVariant = {
      id: doc.id,
      sku: doc.sku,
      image: doc.image,
      svg: doc.svg,
      type: doc.type,
      option1: results.option1.value(),
      option2: results.option2.value(),
      option3: results.option3.value(),
      manufacturingCost: results.manufacturingCost.value(),
      shippingCost: results.shippingCost.value(),
      weight: results.weight.value(),
      productionData: doc.productionData,
      personalizationRules: results.personalizationRules.value(),
    };

    const variant = new SalesVariant(value, doc);
    return Result.ok(variant);
  }
  private static nullCatalogVariant(): ResultError {
    return new InvalidSalesVariant(
      [],
      null,
      `Failed to create SalesVariant: CatalogVariant was undefined.`
    );
  }
  private static nullDocument(doc: null): ResultError {
    return new InvalidSalesVariant(
      [],
      doc,
      `Failed to load SalesVariant: MongoSalesVariant is undefined.`
    );
  }

  private static createPersonalizationRules(
    dto: CatalogVariant
  ): Result<SalesPersonalizationRule[]> {
    let results = dto.personalizationRules.map((r) =>
      SalesPersonalizationRule.from(r)
    );
    const failures = results
      .filter((res) => res.isFailure)
      .map((res) => res.error);
    const successes = results.filter((r) => r.isSuccess).map((r) => r.value());
    if (failures.length) {
      return Result.fail(
        SalesVariant.failedToCreatePersonalizationRules(failures, dto)
      );
    }
    return Result.ok(successes);
  }
  private static loadPersonalizationRules(
    dto: MongoSalesVariant
  ): Result<SalesPersonalizationRule[]> {
    let results = dto.personalizationRules.map((r) =>
      SalesPersonalizationRule.from(r)
    );
    const failures = results
      .filter((res) => res.isFailure)
      .map((res) => res.error);
    const successes = results.filter((r) => r.isSuccess).map((r) => r.value());
    if (failures.length) {
      return Result.fail(
        SalesVariant.failedToLoadPersonalizationRules(failures, dto)
      );
    }
    return Result.ok(successes);
  }
  private static invalidSalesVariant(
    errors: ResultError[],
    dto: CatalogVariant
  ): ResultError {
    return new InvalidSalesVariant(
      errors,
      { ...dto },
      `Failed to create SalesVariant. See inner error for details.`
    );
  }
  private static failedToLoadSalesVariant(
    errors: ResultError[],
    doc: MongoSalesVariant
  ): ResultError {
    return new InvalidSalesVariant(
      errors,
      { ...doc },
      `Failed to load SalesVariant. See inner error for details.`
    );
  }
  private static failedToCreatePersonalizationRules(
    failures: ResultError[],
    dto: CatalogVariant
  ): ResultError {
    return new InvalidSalesVariant(
      failures,
      dto,
      `FailedToCreatePersonalizationRules`
    );
  }

  private static failedToLoadPersonalizationRules(
    failures: ResultError[],
    dto: MongoSalesVariant
  ): ResultError {
    return new InvalidSalesVariant(
      failures,
      dto,
      `FailedToLoadPersonalizationRules`
    );
  }
}
