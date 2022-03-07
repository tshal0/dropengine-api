export class ResultError {
  public readonly name: string;
  public readonly message: string;
  public readonly stack: string;
  public readonly inner: ResultError[];
  public readonly value?: any | undefined;
  constructor(
    error: Error,
    inner?: ResultError[] | undefined,
    value?: any | undefined,
  ) {
    this.message = error.message;
    this.value = value;

    this.name = error.name;
    this.inner = inner;
  }
}

interface HasValue<T> {
  value?: T | undefined;
}

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: ResultError;
  private _value: T;
  private _id: string;
  private constructor(
    isSuccess: boolean,
    error?: ResultError,
    value?: T,
    id?: any | undefined,
  ) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
        successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
        needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;

    this._value = value;
    this._id = id;

    Object.freeze(this);
  }

  public value(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }

    return this._value;
  }
  public getId(): string {
    return this._id;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(
    error?: ResultError,
    id?: string | undefined,
  ): Result<U> {
    return new Result<U>(false, error, null, id);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
