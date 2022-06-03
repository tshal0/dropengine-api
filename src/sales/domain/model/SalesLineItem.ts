import { PersonalizationRule } from "@catalog/model";
import { compact, toLower } from "lodash";
import {
  InvalidPersonalizationFlag,
  IOrderFlag,
  LineItemOptionFlagReason,
  MissingPersonalizationFlag,
  OrderFlag,
} from "./OrderFlag";
import { IPersonalization, Personalization } from "./Personalization";
import { ISalesVariantProps, SalesVariant } from "./SalesVariant";
export interface ISalesLineItemProps {
  lineNumber: number;
  quantity: number;
  variant: ISalesVariantProps;
  personalization: IPersonalization[];
  flags: OrderFlag[];
}
export interface ISalesLineItem {
  lineNumber: number;
  quantity: number;
  variant: SalesVariant;
  personalization: Personalization[];
  flags: OrderFlag[];
}
export class SalesLineItem implements ISalesLineItem {
  private _lineNumber: number = 0;
  private _quantity: number = 0;
  private _variant: SalesVariant = new SalesVariant();
  private _personalization: Personalization[] = [];
  private _flags: OrderFlag[] = [];
  constructor(props?: ISalesLineItemProps | undefined) {
    if (props) {
      this._lineNumber = props.lineNumber;
      this._quantity = props.quantity;
      this._variant = new SalesVariant(props.variant);

      this._personalization = props.personalization?.length
        ? props.personalization.map((p) => new Personalization(p))
        : [];
      this._flags = this.validate();
    }
  }

  /**
   * Validates self and returns generated flags.
   * @returns {OrderFlag[]}
   */
  public validate(): IOrderFlag<any>[] {
    const flags: IOrderFlag<any>[] = [];
    const { lineNumber, personalization, variant } = this;
    let rules = variant.personalizationRules;
    for (let i = 0; i < rules.length; i++) {
      const { label, maxLength, options, pattern, required } = rules[i];
      const propName = toLower(label);
      let prop = personalization.find((p) => toLower(p.name) === propName);
      if (required && !prop) {
        flags.push(
          new MissingPersonalizationFlag({
            lineNumber,
            property: label,
            reason: LineItemOptionFlagReason.MISSING,
          })
        );
        continue;
      }
      if (maxLength && prop?.value?.length > maxLength) {
        flags.push(
          new InvalidPersonalizationFlag({
            lineNumber,
            property: label,
            value: prop.value,
            reason: LineItemOptionFlagReason.INVALID_LENGTH,
          })
        );
      }
      if (options?.length) {
        let isValidOption = compact(options.split(",")).includes(prop.value);
        if (!isValidOption) {
          flags.push(
            new InvalidPersonalizationFlag({
              lineNumber,
              property: label,
              value: prop.value,
              options: options,
              reason: LineItemOptionFlagReason.INVALID_OPTIONS,
            })
          );
        }
      }
      if (typeof pattern === "string") {
        let cleanPattern = pattern.replace("’", "'");
        cleanPattern = cleanPattern.replace("”", '"');

        console.log({ pattern, cleanPattern, prop, rule: rules[i].raw() });
        try {
          let re = new RegExp(cleanPattern, "g");
          let validProp = re.test(prop.value);
          if (!validProp) {
            flags.push(
              new InvalidPersonalizationFlag({
                lineNumber,
                property: label,
                value: prop.value,
                pattern,
                reason: LineItemOptionFlagReason.BAD_CHARACTER,
              })
            );
          }
        } catch (err) {
          console.error(`InvalidRegularExpressiong for ${variant.sku}`, err);
        }
      }
    }
    return flags;
  }

  public raw(): ISalesLineItemProps {
    return {
      flags: this._flags,
      lineNumber: this._lineNumber,
      quantity: this._quantity,
      variant: this._variant.raw(),
      personalization: this._personalization.map((p) => p.raw()),
    };
  }

  public set lineNumber(val: number) {
    this._lineNumber = val;
  }
  public get lineNumber(): number {
    return this._lineNumber;
  }
  public set quantity(val: number) {
    this._quantity = val;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public set personalization(val: Personalization[]) {
    this._personalization = val.map((v) => new Personalization(v));
  }
  public get personalization(): Personalization[] {
    return this._personalization;
  }
  public set variant(val: SalesVariant) {
    this._variant = val;
  }
  public get variant(): SalesVariant {
    return this._variant;
  }
  public set flags(val: OrderFlag[]) {
    this._flags = val;
  }
  public get flags(): OrderFlag[] {
    return this._flags;
  }
}
