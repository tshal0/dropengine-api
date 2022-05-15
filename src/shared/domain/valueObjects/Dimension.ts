import { isFinite } from "lodash";
import { Result, ResultError } from "../Result";
import { ValueObject } from "./ValueObject";

export interface IDimension {
  dimension: number;
  units: "in" | "mm";
}
export enum DimensionError {
  InvalidDimension = "InvalidDimension",
}

export class InvalidDimension implements ResultError {
  public stack: string;
  public name = DimensionError.InvalidDimension;
  public message: string;
  public inner: ResultError[];

  constructor(public value: IDimension, public reason: string) {
    this.message = `${DimensionError.InvalidDimension}: ${reason}`;
  }
}
export class Dimension extends ValueObject<IDimension> {
  static from(dto: IDimension): Result<Dimension> {
    if (`${dto?.units}` == "cm") {
      dto.units = "mm";
      dto.dimension = 10 * +dto.dimension;
    }
    if (!["in", "mm"].includes(dto?.units)) {
      return Result.fail(
        new InvalidDimension(dto, `'${dto?.units}' must be 'in' or 'mm'.`)
      );
    }
    if (!isFinite(dto.dimension)) {
      return Result.fail(
        new InvalidDimension(dto, `'${dto?.dimension}' is not a number.`)
      );
    }
    let value = new Dimension({ units: dto?.units, dimension: dto?.dimension });
    return Result.ok(value);
  }

  static default(): Dimension {
    return new Dimension({
      units: "mm",
      dimension: 0,
    });
  }
}
