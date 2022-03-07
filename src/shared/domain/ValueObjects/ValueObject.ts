export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T> {
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }
  protected readonly _props: Readonly<ValueObjectProps<T>>;

  protected constructor(props: ValueObjectProps<T>) {
    this._props = Object.freeze(props);
  }

  /**
   *  Check if two Value Objects are equal. Checks structural equality.
   * @param vo ValueObject
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }
  /**
   * Get raw props object or value.
   */
  public value(): T {
    if ([null, undefined].includes(this._props)) {
      return null;
    }
    if (this.isDomainPrimitive(this._props)) {
      return this._props.value;
    }
    const propsCopy = convertPropsToObject(this._props);

    return Object.freeze(propsCopy);
  }

  private isDomainPrimitive(
    obj: unknown
  ): obj is DomainPrimitive<T & (Primitives | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, "value")) {
      return true;
    }
    return false;
  }
}

export function convertToPlainObject(item: any): any {
  if (ValueObject.isValueObject(item)) {
    return item.value();
  }
  return item;
}

/**
 * Converts Entity/Value Objects props to a plain object.
 * Useful for testing and debugging.
 * @param props
 */

export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props };

  // eslint-disable-next-line guard-for-in
  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
        return convertToPlainObject(item);
      });
    }
    propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
  }

  return propsCopy;
}
