export class AcceptShopifyInstallDto {
  code: string;
  hmac: string;
  timestamp: Date;
  host: string;
  state: number;
  shop: string;

  url: string;
  installId: string;
}
