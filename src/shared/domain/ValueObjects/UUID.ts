import { v4 as uuidV4, validate } from "uuid";
import { ValueObject } from "./ValueObject";
import { UnprocessableEntityException } from "@nestjs/common";
import { Result, ResultError } from "../Result";
export abstract class ID extends ValueObject<string> {
  protected constructor(value: string) {
    super({ value });
  }
}

export class InvalidUuidException extends UnprocessableEntityException {
  constructor(message: string, id: string, error?: string) {
    const response = {
      id: id,
      message: message,
      error: error ?? `INVALID_UUID`,
    };
    super(response, message);
  }
}
export enum UuidError {
  InvalidUuid = "InvalidUuid",
}

export class InvalidUuidError implements ResultError {
  public stack: string;
  public name = UuidError.InvalidUuid;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class UUID extends ID {
  /**
   *Returns new ID instance with randomly generated ID value
   * @static
   * @return {*}  {ID}
   * @memberof ID
   */
  static generate(): UUID {
    return new UUID(uuidV4());
  }

  static from(value: any): Result<UUID> {
    try {
      let result = UUID.validate(value);
      if (result.isFailure) {
        return result;
      }
      return Result.ok(new UUID(result.value()));
    } catch (error) {
      return Result.fail(
        new InvalidUuidError(value, `UUID must be a valid UUID.`)
      );
    }
  }
  static validate(value: any): Result<any> {
    try {
      validate(value);
      return Result.ok(value);
    } catch (error) {
      return Result.fail(
        new InvalidUuidError(value, `UUID must be a valid UUID (v4).`)
      );
    }
  }
}
