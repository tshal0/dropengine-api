import { UpdatePersonalizationDto } from "@sales/dto/UpdatePersonalizationDto";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class PersonalizationChanged extends SalesOrderEvent<UpdatePersonalizationDto> {
  constructor(aggId: string, details: UpdatePersonalizationDto) {
    super(
      aggId,
      PersonalizationChanged.name,
      SalesOrderEventName.PersonalizationChanged,
      details
    );
  }
}
