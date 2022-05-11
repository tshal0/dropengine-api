import { LineItemPropertyDto } from "@sales/dto";


export class UpdatePersonalizationDto {
  orderId: string;
  lineItemId: string;
  personalization: LineItemPropertyDto[];
}
