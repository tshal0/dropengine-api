import { isFinite } from "lodash";
import { Result, ResultError } from "../Result";
import { ValueObject } from "./ValueObject";

export interface IWeight {
  dimension: number;
  units: "oz" | "g";
}

export enum WeightError {
  InvalidWeight = "InvalidWeight",
}

export class InvalidWeight implements ResultError {
  public stack: string;
  public name = WeightError.InvalidWeight;
  public message: string;
  public inner: ResultError[];

  constructor(public value: IWeight, public reason: string) {
    this.message = `${WeightError.InvalidWeight}: ${reason}`;
  }
}
export class Weight extends ValueObject<IWeight> {
  static from(dto: IWeight): Result<Weight> {
    if (!["oz", "g"].includes(dto?.units)) {
      return Result.fail(
        new InvalidWeight(dto, `'${dto?.units}' must be 'oz' or 'g'.`)
      );
    }
    if (isNaN(dto?.dimension) || !isFinite(dto?.dimension)) {
      return Result.fail(
        new InvalidWeight(dto, `'${dto?.dimension}' is not a number.`)
      );
    }
    let value = new Weight({ units: dto?.units, dimension: dto?.dimension });
    return Result.ok(value);
  }
  public static default(): Weight {
    return new Weight({ units: "g", dimension: 0 });
  }
}
