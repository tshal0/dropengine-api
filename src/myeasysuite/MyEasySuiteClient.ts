import { IAuth0User, Auth0User } from "@auth0/domain/Auth0ExtendedUser";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@shared/exceptions";
import { AzureTelemetryService } from "@shared/modules";
import { map, catchError, lastValueFrom } from "rxjs";
import { IMESProductVariant } from "./dto/MESProductVariant";

export interface IMyEasySuiteClient {
  getVariantBySku(sku: string);
}

@Injectable()
export class MyEasySuiteClient implements IMyEasySuiteClient {
  constructor(
    private readonly logger: AzureTelemetryService,
    private http: HttpService
  ) {}
  async getVariantBySku(sku: string) {
    const resp$ = await this.http.get(`/api/productvariants/${sku}`).pipe(
      map((r) => r.data as IMESProductVariant),
      catchError((e) => {
        this.logger.debug({ error: e?.response?.data, sku });
        throw new EntityNotFoundException(`ProductVariantNotFound`, sku);
      })
    );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
}
