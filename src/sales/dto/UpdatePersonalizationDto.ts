import { LineItemPropertyDto } from "@sales/dto";

export class UpdatePersonalizationDto {
  orderId: string;
  lineNumber: number;
  personalization: LineItemPropertyDto[];
}
