import { ValidationError } from "@nestjs/common";
import { SalesOrderValidationError } from "./SalesOrderValidationError";

export function generateValidationError(
  errors: ValidationError[],
  parent: string = null
) {
  return errors.reduce((finalErrors, err): SalesOrderValidationError[] => {
    let property = "";
    if (parent) {
      property = `${parent}`;
      if (parent != err.property)
        property = `${property}.`;
    }
    if (parent != err.property)
      property = `${property}${err.property}`;
    if (err.constraints) {
      const message = Object.values(err.constraints).join("; ");
      finalErrors.push(new SalesOrderValidationError(property, message));
    }

    if (err.children?.length) {
      const childErr = generateValidationError(err.children, property);
      finalErrors = finalErrors.concat(childErr);
    }

    return finalErrors;
  }, [] as SalesOrderValidationError[]);
}
