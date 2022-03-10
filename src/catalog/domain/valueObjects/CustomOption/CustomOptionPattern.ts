import { CustomOptionDto } from "@catalog/dto/Product/CreateProductDto";
import { Result, ValueObject } from "@shared/domain";
import { InvalidCustomOptionPattern } from "./CustomOptionErrors";

export class CustomOptionPattern extends ValueObject<RegExp> {
  static patternRequired(type: string) {
    let types = ["input", "text"];
    if (types.includes(type)) {
      return true;
    }
    return false;
  }
  static from(dto: CustomOptionDto): Result<CustomOptionPattern> {
    if (CustomOptionPattern.patternRequired(dto.type)) {
      if ([null, undefined].includes(dto.pattern)) {
        return Result.ok(new CustomOptionPattern(null));
      }
      // Validate pattern is valid regex
      try {
        let pattern = new RegExp(dto.pattern);
        return Result.ok(new CustomOptionPattern(pattern));
      } catch (e) {
        return Result.fail(new InvalidCustomOptionPattern(dto.pattern));
      }
    } else {
      if (dto.pattern?.length) {
        return Result.fail(
          new InvalidCustomOptionPattern(
            dto.pattern,
            `Pattern '${dto.pattern}' is not required for type '${dto.type}'`
          )
        );
      }
      return Result.ok(new CustomOptionPattern(null));
    }
  }
  public value(): RegExp {
    return this._props;
  }
  public toString(): string {
    return this._props?.source;
  }
}
