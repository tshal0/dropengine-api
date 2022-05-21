import { LineItemProperty } from "@sales/features/PlaceOrderRequest";

export class UpdatePersonalizationDto {
  orderId: string;
  lineNumber: number;
  personalization: LineItemProperty[];
}
