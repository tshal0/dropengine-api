import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ShopifyApiClient {
  private readonly logger: Logger = new Logger(ShopifyApiClient.name);
  constructor(private http: HttpService) {}

  async createAccessToken(
    url: string,
    payload: any
  ): Promise<{ access_token: string; scope: string }> {
    const resp$ = await this.http.post<{ access_token: string; scope: string }>(
      url,
      payload,
      {}
    );
    const resp = await lastValueFrom(resp$);
    return resp.data;
  }
  async getShop(shop: string, accessToken: string): Promise<any> {
    const shopRequestURL = "https://" + shop + "/admin/api/2020-04/shop.json";
    const shopRequestHeaders = { "X-Shopify-Access-Token": accessToken };
    return await this.http.get(shopRequestURL, {
      headers: shopRequestHeaders,
    });
  }
}
