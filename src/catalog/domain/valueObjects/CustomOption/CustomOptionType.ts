import { Result, ValueObject } from "@shared/domain";
import { toLower } from "lodash";
import { InvalidCustomOptionType } from "./CustomOptionErrors";

export class CustomOptionType extends ValueObject<string> {
  static from(value: string): Result<CustomOptionType> {
    //* Old types are from MEM; new types are hopefully going to be how we implement the new LivePreview module.
    let oldTypes = ["input", "dropdownlist"];
    let newTypes = ["select", "dropdown", "text"];
    let type = toLower(value);
    let types = oldTypes.concat(newTypes);
    let valid = types.includes(type);
    if (!valid) {
      return Result.fail(new InvalidCustomOptionType(value));
    } else return Result.ok(new CustomOptionType({ value: type }));
  }
}
