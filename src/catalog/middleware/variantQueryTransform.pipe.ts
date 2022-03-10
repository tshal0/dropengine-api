import { VariantQueryDto } from "@catalog/dto/ProductVariant/VariantQueryDto";
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
  ValidationError as NestValidationError,
  HttpStatus,
} from "@nestjs/common";
import { leaf } from "@shared/utils";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { uniqBy } from "lodash";
import { parse } from "querystring";
import moment from "moment";
import {
  VariantQueryValidationException,
  VariantQueryValidationError,
  CreateVariantQueryErrorCode,
} from "@catalog/exceptions";
import { ProductTypeName, ProductTypeUUID } from "@catalog/domain";

@Injectable()
export class VariantQueryTransformPipe
  implements PipeTransform<string, Promise<VariantQueryDto>>
{
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let validationErrors = generateVariantQueryValidationError(errors);
      validationErrors = uniqBy(validationErrors, (e) => e.property);
      throw new VariantQueryValidationException(
        "VariantQueryValidationFailed",
        validationErrors
      );
    }

    const parsed = parse(value);
    const dto: VariantQueryDto = object;

    if (errors.length) {
      throw new UnprocessableEntityException(errors, `Invalid Query`);
    }

    return dto;
  }
}

export const generateVariantQueryValidationError = (
  errors: NestValidationError[],
  parent: string = null
) => {
  return errors.reduce(
    (finalErrors, err: NestValidationError): VariantQueryValidationError[] => {
      // Property is line_items, children is [{sku}, {line_item_properties}]
      let property = "";
      if (parent) {
        property = `${parent}.`;
      }
      property = `${property}${err.property}`;
      if (err.constraints) {
        const errorCodeKey = property?.replace(/([.][0-9][.]|[.])/g, "_");
        const code =
          CreateVariantQueryErrorCode[errorCodeKey] || "InvalidQuery";
        const message = Object.values(err.constraints).join("; ");
        finalErrors.push(
          new VariantQueryValidationError(code, message, property)
        );
      }

      if (err.children?.length) {
        const childErr = generateVariantQueryValidationError(
          err.children,
          property
        );
        finalErrors = finalErrors.concat(childErr);
      }

      return finalErrors;
    },
    [] as VariantQueryValidationError[]
  );
};
