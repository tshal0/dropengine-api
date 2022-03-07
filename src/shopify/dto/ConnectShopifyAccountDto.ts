import { UUID } from "@shared/domain/valueObjects";
import { Type } from "class-transformer";

export class ConnectShopifyAccountDto {
  userId: string;
  shop: string;
  @Type(() => Number)
  timestamp: number;
  hmac: string;
}
