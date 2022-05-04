import { Result, ResultError, ValueObject } from "@shared/domain";
import mongoose, { Types } from "mongoose";
export enum LineItemIDError {
  InvalidLineItemID = "InvalidLineItemID",
}

export class InvalidLineItemIDError implements ResultError {
  public stack: string;
  public name = LineItemIDError.InvalidLineItemID;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class LineItemID extends ValueObject<string> {
  static from(id: Types.ObjectId | string): Result<LineItemID> {
    if ([null, undefined].includes(id)) {
      return Result.ok(new LineItemID({ value: null }));
    } else if (typeof id === "string") {
      if (mongoose.Types.ObjectId.isValid(id)) {
        let value = new mongoose.Types.ObjectId(id).toString();
        let sid = new LineItemID({ value });
        return Result.ok(sid);
      }
    } else if (id.toString) {
      let val = id.toString();

      if (mongoose.Types.ObjectId.isValid(val)) {
        let value = new mongoose.Types.ObjectId(val).toString();
        let sid = new LineItemID({ value });
        return Result.ok(sid);
      }
    }
    return Result.fail(LineItemID.invalid(id));
  }

  private static invalid(id: any): ResultError {
    return new InvalidLineItemIDError(
      `${id}`,
      `LineItemID must be a valid ObjectId.`
    );
  }
}
