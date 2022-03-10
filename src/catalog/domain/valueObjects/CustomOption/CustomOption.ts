import { InvalidCustomOption } from "@catalog/domain/errors/ProductErrors";
import { CustomOptionDto } from "@catalog/dto/Product/CreateProductDto";
import { convertToPlainObject, Result, ValueObject } from "@shared/domain";
import { toLower } from "lodash";

import { CustomOptionMaxLength } from "./CustomOptionMaxLength";
import { CustomOptionOptions } from "./CustomOptionOptions";
import { CustomOptionPattern } from "./CustomOptionPattern";
import { CustomOptionType } from "./CustomOptionType";
import {
  CustomOptionLabel,
  CustomOptionName,
  CustomOptionPlaceholder,
  CustomOptionRequired,
} from "./CustomOptionValueObjects";

export interface ICustomOptionProps {
  [prop: string]: any;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  maxLength?: number;
  pattern?: string;
  options?: string;
}
export interface ICustomOption {
  name: CustomOptionName;
  label: CustomOptionLabel;
  placeholder: CustomOptionPlaceholder;
  required: CustomOptionRequired;
  type: CustomOptionType;
  maxLength?: CustomOptionMaxLength;
  pattern?: CustomOptionPattern;
  options?: CustomOptionOptions;
}
export class CustomOption extends ValueObject<ICustomOption> {
  private constructor(props: ICustomOption) {
    super(props);
  }

  public value(): ICustomOption {
    let raw: ICustomOption = {
      name: this._props.name,
      label: this._props.label,
      placeholder: this._props.placeholder,
      required: this._props.required,
      type: this._props.type,
      maxLength: this._props.maxLength,
      pattern: this._props.pattern,
      options: this._props.options,
    };
    return Object.seal(raw);
  }

  public props(): ICustomOptionProps {
    let props: ICustomOptionProps = {
      name: this._props.name.value(),
      label: this._props.label.value(),
      placeholder: this._props.placeholder.value(),
      required: this._props.required.value(),
      type: this._props.type.value(),
      maxLength: this._props.maxLength.value(),
      pattern: this._props.pattern.toString(),
      options: this._props.options.value(),
    };
    return props;
  }

  public static from(dto: CustomOptionDto): Result<CustomOption> {
    //* Acceptable modifications to DTO:
    // - Name can be generated from Label
    // - Type can be toLowered from Type

    dto.type = dto.type ? toLower(dto.type) : dto.type;

    if ([null, undefined, ""].includes(dto.name) && dto?.label?.length) {
      dto.name = CustomOption.generateNameFromLabel(dto);
    }

    let validName = CustomOptionName.from(dto.name);
    let validLabel = CustomOptionLabel.from(dto.label);
    let validPlaceholder = CustomOptionPlaceholder.from(dto.placeholder);
    let validRequired = CustomOptionRequired.from(dto.required);
    let validType = CustomOptionType.from(dto.type);
    let validMaxLength = CustomOptionMaxLength.from(dto);
    let validPattern = CustomOptionPattern.from(dto);
    let validOptions = CustomOptionOptions.from(dto);
    let allProps = [
      validName,
      validLabel,
      validPlaceholder,
      validRequired,
      validType,
      validMaxLength,
      validPattern,
      validOptions,
    ];
    let failures = allProps.filter((p) => p.isFailure).map((f) => f.error);

    if (!failures.length) {
      const props: ICustomOption = {
        name: validName.value(),
        label: validLabel.value(),
        placeholder: validPlaceholder.value(),
        required: validRequired.value(),
        type: validType.value(),
        maxLength: validMaxLength.value(),
        pattern: validPattern.value(),
        options: validOptions.value(),
      };
      return Result.ok(new CustomOption(props));
    } else {
      return Result.fail(new InvalidCustomOption([...failures], { ...dto }));
    }
  }

  private static generateNameFromLabel(dto: CustomOptionDto) {
    return toLower(dto.label)?.trim().replace(" ", "_");
  }
}
