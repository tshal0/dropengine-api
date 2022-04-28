import {
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { CreateLineItemDto } from "./CreateLineItemDto";

export function IsArrayOfObjects(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: "IsArrayOfObjects",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return (
            Array.isArray(value) &&
            value.every((element: any) => element instanceof Object)
          );
        },
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          return `${validationArguments.property} must be an array of objects`;
        },
      },
    });
  };
}
