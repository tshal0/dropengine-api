import { Result, ValueObject } from "@shared/domain";
import { isNull, isUndefined } from "lodash";
import { IVariantOption } from "../../interfaces";

export class VariantOption extends ValueObject<IVariantOption> {
  static from(value: IVariantOption): Result<VariantOption> {
    if ([null, undefined].includes(value)) {
      let val = new VariantOption({ enabled: false, name: null, option: null });
      return Result.ok(val);
    }
    if ([null, undefined].includes(value.name)) {
      //TODO: InvalidVariantOption: MissingName
    }
    let val = new VariantOption(value);
    return Result.ok(val);
  }
}
