import { Result, ValueObject } from "@shared/domain";
import {
  InvalidCustomOptionLabel,
  InvalidCustomOptionName,
  InvalidCustomOptionPlaceholder,
  InvalidCustomOptionRequired,
} from "./CustomOptionErrors";

export class CustomOptionName extends ValueObject<string> {
  static from(value: string): Result<CustomOptionName> {
    return value?.length
      ? Result.ok(new CustomOptionName({ value }))
      : Result.fail(new InvalidCustomOptionName(value));
  }
}
export class CustomOptionLabel extends ValueObject<string> {
  static from(value: string): Result<CustomOptionLabel> {
    return value?.length
      ? Result.ok(new CustomOptionLabel({ value }))
      : Result.fail(new InvalidCustomOptionLabel(value));
  }
}
export class CustomOptionPlaceholder extends ValueObject<string> {
  static from(value: string): Result<CustomOptionPlaceholder> {
    return value?.length
      ? Result.ok(new CustomOptionPlaceholder({ value }))
      : Result.fail(new InvalidCustomOptionPlaceholder(value));
  }
}
export class CustomOptionRequired extends ValueObject<boolean> {
  static from(value: boolean): Result<CustomOptionRequired> {
    return typeof value == "boolean"
      ? Result.ok(new CustomOptionRequired({ value }))
      : Result.fail(new InvalidCustomOptionRequired(value));
  }
}
