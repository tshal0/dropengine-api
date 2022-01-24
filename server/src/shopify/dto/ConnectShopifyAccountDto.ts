import { UUID } from "@shared/domain/ValueObjects";
import { Type } from "class-transformer";

export class ConnectShopifyAccountDto {
  userId: string;
  shop: string;
  @Type(() => Number)
  timestamp: number;
  hmac: string;
}
