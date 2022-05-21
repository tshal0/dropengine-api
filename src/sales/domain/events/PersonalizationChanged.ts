import { IPersonalization } from "../model";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export interface IPersonalizationChangeDetails {
  lineNumber: number;
  personalization: IPersonalization[];
}

export class PersonalizationChanged extends SalesOrderEvent<IPersonalizationChangeDetails> {
  constructor(aggId: string, details: IPersonalizationChangeDetails) {
    super(
      aggId,
      PersonalizationChanged.name,
      SalesOrderEventName.PersonalizationChanged,
      details
    );
  }
}
