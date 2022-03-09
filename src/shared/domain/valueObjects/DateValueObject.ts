import moment from 'moment';
import { isValidDate } from '../../utils/isValidDate.util';
import { Result, ResultError } from '../Result';
import { ValueObject } from './ValueObject';

export class DateValueObjectValidationError extends Error {
  public readonly name: string = `DateValueObjectValidationError`;
  public static readonly msg = `DateValueObject must be a valid Date.`;
}

export type DateValueObjectProp = string | number | Date;

export class DateValueObject extends ValueObject<DateValueObjectProp> {
  value(): Date {
    return moment(this._props.value).toDate();
  }

  // Can't use the `new` keyword from outside the scope of the class.
  private constructor(value: DateValueObjectProp) {
    const date = new Date(value);
    super({ value: date });
  }

  public static create(prop: DateValueObjectProp): Result<DateValueObject> {
    let result = this.validate(prop);
    if (result.isFailure) {
      return result;
    } else {
      return Result.ok<DateValueObject>(new DateValueObject(prop));
    }
  }
  public static validate(prop: DateValueObjectProp): Result<any> {
    if (!isValidDate(prop)) {
      const msg = DateValueObjectValidationError.msg;
      let error: ResultError = new ResultError(
        new DateValueObjectValidationError(msg),
        [],
        prop?.toString(),
      );
      return Result.fail<DateValueObject>(error);
    }
  }

  public static now(): DateValueObject {
    return new DateValueObject(moment().toDate());
  }
}
