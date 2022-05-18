import { IAuth0User, Auth0User } from "@auth0/domain/Auth0ExtendedUser";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@shared/exceptions";
import { AzureTelemetryService } from "@shared/modules";
import { map, catchError, lastValueFrom } from "rxjs";
import { MyEasySuiteOrder } from "./domain/MyEasySuiteOrder";
import { MyEasySuiteProductVariant } from "./dto/MESProductVariant";

export interface IMyEasySuiteClient {
  getVariantBySku(sku: string);
}

@Injectable()
export class MyEasySuiteClient implements IMyEasySuiteClient {
  constructor(private http: HttpService) {}

  /**
   * Looks up Variant in MyEasySuite: Orders.
   * @param sku VariantSKU
   * @returns MyEasySuiteProductVariant
   * @throws EntityNotFoundException
   */
  async getVariantBySku(sku: string) {
    const resp$ = await this.http.get(`/api/productvariants/${sku}`).pipe(
      map((r) => r.data as MyEasySuiteProductVariant),
      catchError((e) => {
        throw new EntityNotFoundException(`ProductVariantNotFound`, sku);
      })
    );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
  async getOrderById(id: string): Promise<MyEasySuiteOrder> {
    const resp$ = await this.http.get(`/api/orders/${id}`).pipe(
      map((r) => r.data as any),
      catchError((e) => {
        throw new EntityNotFoundException(`OrderNotFound`, id);
      })
    );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
}
