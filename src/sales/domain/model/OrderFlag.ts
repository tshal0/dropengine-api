export enum OrderFlagType {
  InvalidPersonalization = "InvalidPersonalization",
  MissingPersonalization = "MissingPersonalization",
  BadCharacter = "BadCharacter",
}
export interface IOrderFlag<T> {
  type: OrderFlagType;
  message: string;
  details: T;
}
export type OrderFlag =
  | InvalidPersonalizationFlag
  | BadCharacterFlag
  | MissingPersonalizationFlag;
export enum LineItemOptionFlagReason {
  MISSING = "MISSING",
  INVALID = "INVALID",
  INVALID_LENGTH = "INVALID_LENGTH",
  INVALID_OPTIONS = "INVALID_OPTION",
  BAD_CHARACTER = "BAD_CHARACTER",
}
export interface ILineItemOptionFlagDetails {
  lineNumber: number;
  property: string;
  value?: string | undefined;
  reason?: LineItemOptionFlagReason | undefined;
  pattern?: string | undefined;
  options?: string | undefined;
}

export class InvalidPersonalizationFlag
  implements IOrderFlag<ILineItemOptionFlagDetails>
{
  type = OrderFlagType.InvalidPersonalization;
  message: string;
  details: ILineItemOptionFlagDetails;
  constructor(details: ILineItemOptionFlagDetails) {
    this.details = details;
    this.message =
      `Line Item #${details.lineNumber} ` +
      `has invalid property '${details.property}': '${details.value}'. Reason: ${details.reason}`;
  }
}
export class BadCharacterFlag
  implements IOrderFlag<ILineItemOptionFlagDetails>
{
  type = OrderFlagType.BadCharacter;
  message: string;
  details: ILineItemOptionFlagDetails;
  constructor(details: ILineItemOptionFlagDetails) {
    this.details = details;
    this.details.reason = LineItemOptionFlagReason.BAD_CHARACTER;
    this.message =
      `Line Item #${details.lineNumber} ` +
      `has a bad character in property '${details.property}': '${details.value}'. Reason: ${this.details.reason}`;
  }
}
export class MissingPersonalizationFlag
  implements IOrderFlag<ILineItemOptionFlagDetails>
{
  type = OrderFlagType.MissingPersonalization;
  message: string;
  details: ILineItemOptionFlagDetails;
  constructor(details: ILineItemOptionFlagDetails) {
    this.details = details;
    this.details.reason = LineItemOptionFlagReason.MISSING;
    this.message =
      `Line Item #${details.lineNumber} ` +
      `is missing property '${details.property}'.`;
  }
}
