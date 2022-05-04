import { ILineItemProperty, ISalesLineItemProps } from "./ISalesLineItem";
import {
  BadCharacterFlag,
  InvalidPersonalizationFlag,
  LineItemOptionFlagReason,
  MissingPersonalizationFlag,
  OrderFlag,
} from "./OrderFlag";

export class Personalization {
  static validate(li: ISalesLineItemProps): OrderFlag[] {
    const props = li.personalization;
    const rules = li?.variant?.personalizationRules;

    const flags = rules.flatMap((rule) => {
      const flags: OrderFlag[] = [];
      const label = rule.label;
      const prop = props.find((p) => p.name === label);
      if (prop === undefined) {
        flags.push(Personalization.missingProperty(li, label));
        return flags;
      }
      if (rule.maxLength && prop.value?.length > rule.maxLength) {
        flags.push(Personalization.invalidLength(li, prop));
      }
      let re = new RegExp(rule.pattern, "g");
      let validProp = re.test(prop.value);
      if (!validProp) {
        flags.push(Personalization.badCharacter(li, prop, rule.pattern));
      }
      return flags;
    });
    return flags;
  }

  private static badCharacter(
    li: ISalesLineItemProps,
    prop: ILineItemProperty,
    pattern: string
  ): BadCharacterFlag {
    return new BadCharacterFlag({
      lineNumber: li.lineNumber,
      property: prop.name,
      value: prop.value,
      pattern: pattern,
      reason: LineItemOptionFlagReason.BAD_CHARACTER,
    });
  }

  private static missingProperty(
    li: ISalesLineItemProps,
    prop: string
  ): InvalidPersonalizationFlag {
    return new MissingPersonalizationFlag({
      lineNumber: li.lineNumber,
      property: prop,
    });
  }
  private static invalidLength(
    li: ISalesLineItemProps,
    prop: ILineItemProperty
  ): InvalidPersonalizationFlag {
    return new InvalidPersonalizationFlag({
      lineNumber: li.lineNumber,
      property: prop.name,
      reason: LineItemOptionFlagReason.INVALID_LENGTH,
    });
  }
}
