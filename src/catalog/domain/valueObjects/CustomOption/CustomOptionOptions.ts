import { Result, ValueObject } from "@shared/domain";
import { CustomOptionDto } from "catalog/dto/CreateProductDto";
import { InvalidCustomOptionOptions } from "./CustomOptionErrors";

export class CustomOptionOptions extends ValueObject<string> {
  static optionsRequired(type: string) {
    let types = ["dropdownlist", "dropdown", "select"];
    if (types.includes(type)) {
      return true;
    }
    return false;
  }
  static from(dto: CustomOptionDto): Result<CustomOptionOptions> {
    if (CustomOptionOptions.optionsRequired(dto.type)) {
      // Validate options are a comma delimited string
      if ([null, undefined].includes(dto.options)) {
        return Result.fail(
          new InvalidCustomOptionOptions(
            dto.options,
            `Options '${dto.options}' must not be null or undefined.`
          )
        );
      }
      let optionsIsStr = typeof dto.options == "string";
      if (!optionsIsStr)
        return Result.fail(
          new InvalidCustomOptionOptions(
            dto.options,
            `Options '${dto.options}' must be a string.`
          )
        );
      let optionsStrHasElements = dto.options.length;
      if (!optionsStrHasElements) {
        return Result.fail(
          new InvalidCustomOptionOptions(
            dto.options,
            `Options '${dto.options}' must have values with Type '${dto.type}'.`
          )
        );
      }
    } else {
      if (dto.options?.length) {
        return Result.fail(
          new InvalidCustomOptionOptions(
            dto.options,
            `Options '${dto.options}' must not exist on CustomOptions with type '${dto.type}'.`
          )
        );
      }
    }

    return Result.ok(new CustomOptionOptions({ value: dto.options }));
  }
}
