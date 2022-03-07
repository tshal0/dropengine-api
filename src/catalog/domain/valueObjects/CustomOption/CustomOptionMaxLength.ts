import { CustomOptionDto } from "@catalog/dto/CreateProductDto";
import { ValueObject, Result } from "@shared/domain";
import { InvalidCustomOptionMaxLength } from "./CustomOptionErrors";

export class CustomOptionMaxLength extends ValueObject<number> {
  static maxLengthRequired(type: string) {
    let types = ["input", "text"];
    if (types.includes(type)) {
      return true;
    }
    return false;
  }
  static from(dto: CustomOptionDto): Result<CustomOptionMaxLength> {
    if (CustomOptionMaxLength.maxLengthRequired(dto.type)) {
      const maxLengthIsNum = typeof dto.maxLength == "number";
      const maxLengthGreaterThan0 = dto.maxLength > 0;
      let valid = dto.maxLength && maxLengthIsNum && maxLengthGreaterThan0;
      if (!valid) {
        return Result.fail(new InvalidCustomOptionMaxLength(dto.maxLength));
      }
    }
    return Result.ok(new CustomOptionMaxLength({ value: dto.maxLength }));
  }
}
