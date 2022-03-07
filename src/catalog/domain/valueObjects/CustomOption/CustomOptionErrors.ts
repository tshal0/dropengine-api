import { ResultError } from "@shared/domain";

export enum CustomOptionErrors {
  INVALID_CUSTOM_OPTION_NAME = `INVALID_CUSTOM_OPTION_NAME`,
  INVALID_CUSTOM_OPTION_LABEL = `INVALID_CUSTOM_OPTION_LABEL`,
  INVALID_CUSTOM_OPTION_PLACEHOLDER = `INVALID_CUSTOM_OPTION_PLACEHOLDER`,
  INVALID_CUSTOM_OPTION_REQUIRED = `INVALID_CUSTOM_OPTION_REQUIRED`,
  INVALID_CUSTOM_OPTION_TYPE = `INVALID_CUSTOM_OPTION_TYPE`,
  INVALID_CUSTOM_OPTION_MAX_LENGTH = `INVALID_CUSTOM_OPTION_MAX_LENGTH`,
  INVALID_CUSTOM_OPTION_PATTERN = `INVALID_CUSTOM_OPTION_PATTERN`,
  INVALID_CUSTOM_OPTION_OPTIONS = `INVALID_CUSTOM_OPTION_OPTIONS`,
}

export class InvalidCustomOptionName implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_NAME;
  public message: string;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Name '${value}' must not be empty.`;
  }
}
export class InvalidCustomOptionLabel implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_LABEL;
  public message = `Label must not be empty.`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Label '${value}' must not be empty.`;
  }
}

export class InvalidCustomOptionPlaceholder implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_PLACEHOLDER;
  public message = `Placeholder must not be empty.`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Placeholder '${value}' must not be empty.`;
  }
}

export class InvalidCustomOptionRequired implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_REQUIRED;
  public message = `Required must be a boolean value.`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Required '${value}' must be a boolean value.`;
  }
}

export class InvalidCustomOptionType implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_TYPE;
  public message = `Type must be one of the following: input, dropdownlist, select, dropdown, text`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Type '${value}' must be one of the following: input, dropdownlist, select, dropdown, text`;
  }
}

export class InvalidCustomOptionMaxLength implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_MAX_LENGTH;
  public message = `MaxLength must be greater than 0.`;
  constructor(public value: number, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `MaxLength '${value}' must be a number greater than 0.`;
  }
}

export class InvalidCustomOptionPattern implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_PATTERN;
  public message = `Pattern must be a valid Regular Expression.`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Pattern '${value}' must be a valid Regular Expression.`;
  }
}

export class InvalidCustomOptionOptions implements ResultError {
  public stack: string;
  public inner: ResultError[];
  public name = CustomOptionErrors.INVALID_CUSTOM_OPTION_OPTIONS;
  public message = `Options must be a comma-delimited array of values.`;
  constructor(public value: string, message?: string | undefined) {
    this.message = message
      ? `${message}`
      : `Options '${value}' must be a comma-delimited array of values.`;
  }
}
