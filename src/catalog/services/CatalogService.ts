import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import moment from "moment";
import {
  ProductTypesRepository,
  ProductsRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { SyncVariant } from "@catalog/useCases/SyncVariant";
import { AzureTelemetryService } from "@shared/modules";
import { MyEasySuiteClient } from "@myeasysuite/MyEasySuiteClient";
import { ProductVariant, VariantSKU } from "@catalog/domain";
import { SyncVariantDto } from "@catalog/dto";
import { Result, ResultError } from "@shared/domain";
import { ICatalogVariant, CatalogVariant } from "./dto/CatalogVariant";
import { ProductVariantUUID } from "@catalog/domain/valueObjects/ProductVariant/VariantUUID";

export class LoadLineItemVariantBySkuDto {
  sku: string;
}
export class LoadLineItemVariantByIdDto {
  id: string;
}
export enum CatalogServiceError {
  FailedToLoadLineItemVariantBySku = "FailedToLoadLineItemVariantBySku",
  FailedToLoadLineItemVariantById = "FailedToLoadLineItemVariantById",
}

export class FailedToLoadLineItemVariantBySkuError implements ResultError {
  public stack: string;
  public name = CatalogServiceError.FailedToLoadLineItemVariantBySku;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: LoadLineItemVariantBySkuDto,
    public reason: string
  ) {
    this.message = `${this.name}` + ` '${value.sku}': ${reason}`;
  }
}
export class FailedToLoadLineItemVariantByIdError implements ResultError {
  public stack: string;
  public name = CatalogServiceError.FailedToLoadLineItemVariantById;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: LoadLineItemVariantByIdDto,
    public reason: string
  ) {
    this.message = `${this.name}` + ` '${value.id}': ${reason}`;
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class CatalogService {
  constructor(
    private _repo: ProductVariantsRepository,
    private _syncVariant: SyncVariant
  ) {}
  get llog() {
    return `[${moment()}][${SyncVariant.name}]`;
  }

  async syncVariant(sku: string) {
    let result = await this._syncVariant.execute({ sku });
  }

  async loadLineItemVariantBySku(
    dto: LoadLineItemVariantBySkuDto
  ): Promise<Result<CatalogVariant>> {
    try {
      let variantSkuResult: Result<any> = null;

      variantSkuResult = VariantSKU.from(dto.sku);
      if (variantSkuResult.isFailure)
        return Result.fail(variantSkuResult.error);
      let vsku: VariantSKU = variantSkuResult.value();
      let loadVariantResult = await this._repo.findBySku(vsku);
      let variant: ProductVariant = null;
      if (loadVariantResult.isFailure) {
        loadVariantResult = await this._syncVariant.execute(dto);
        if (loadVariantResult.isFailure) {
          return Result.fail(
            failedToLoadOrSyncVariantBySku(variantSkuResult, dto)
          );
        }
      }
      variant = loadVariantResult.value();

      let props: ICatalogVariant = {
        id: variant.id,
        sku: variant.sku,
        image: variant.image,
        svg: variant.svg,
        type: variant.type,
        option1: variant.option1,
        option2: variant.option2,
        option3: variant.option3,
        productionData: variant.productionData,
        personalizationRules: variant.personalizationRules,
        manufacturingCost: variant.manufacturingCost,
        shippingCost: variant.shippingCost,
        weight: variant.weight,
      };
      let catalogVariant = new CatalogVariant(props);
      return Result.ok(catalogVariant);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async loadLineItemVariantById(
    dto: LoadLineItemVariantByIdDto
  ): Promise<Result<CatalogVariant>> {
    try {
      let vidResult: Result<any> = null;

      vidResult = ProductVariantUUID.from(dto.id);
      if (vidResult.isFailure) return Result.fail(vidResult.error);
      let variantId: ProductVariantUUID = vidResult.value();
      let loadVariantResult = await this._repo.findById(variantId);
      let variant: ProductVariant = null;
      if (loadVariantResult.isFailure) {
        return Result.fail(failedToLoadOrSyncVariantById(vidResult, dto));
      }
      variant = loadVariantResult.value();

      let props: ICatalogVariant = {
        id: variant.id,
        sku: variant.sku,
        image: variant.image,
        svg: variant.svg,
        type: variant.type,
        option1: variant.option1,
        option2: variant.option2,
        option3: variant.option3,
        productionData: variant.productionData,
        personalizationRules: variant.personalizationRules,
        manufacturingCost: variant.manufacturingCost,
        shippingCost: variant.shippingCost,
        weight: variant.weight,
      };
      let catalogVariant = new CatalogVariant(props);
      return Result.ok(catalogVariant);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
function failedToLoadOrSyncVariantBySku(
  result: Result<any>,
  dto: { sku: string }
): ResultError {
  return new FailedToLoadLineItemVariantBySkuError(
    [result.error],
    dto,
    `FailedToLoadOrSyncVariant`
  );
}

function failedToLoadOrSyncVariantById(
  result: Result<any>,
  dto: { id: string }
): ResultError {
  return new FailedToLoadLineItemVariantByIdError(
    [result.error],
    dto,
    `FailedToLoadVariant`
  );
}
