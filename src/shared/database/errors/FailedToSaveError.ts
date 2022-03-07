import { ResultError } from "@shared/domain/Result";
import { DatabaseError } from "./DatabaseError";

export class FailedToSaveError implements ResultError {
  public stack: string;
  public name = DatabaseError.FailedToSave;
  public message: string;
  public inner: ResultError[];
  constructor(
    public value: { type: string; id: string; name: string; },
    reason: string
  ) {
    this.message = `${this.name} '${value.name}': ${reason}`;
  }
}
