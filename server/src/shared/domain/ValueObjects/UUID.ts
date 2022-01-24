import { v4 as uuidV4, validate } from 'uuid';
import { ValueObject } from './ValueObject';
import { isNull, isEmpty } from 'lodash';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
export abstract class ID extends ValueObject<string> {
  protected constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
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

  static from(value: string) {
    validate(value);
    return new UUID(value);
  }
}
