import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import moment from "moment";
import {
  ProductTypesRepository,
  ProductsRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { SyncVariant } from "@catalog/useCases/SyncVariant";
import { AzureTelemetryService } from "@shared/modules";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
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
  FailedToLoadVariant = "FailedToLoadVariant",
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

  async loadVariantBySku(
    dto: LoadLineItemVariantBySkuDto
  ): Promise<CatalogVariant> {
    let variantSkuResult: Result<any> = null;

    let sku = dto.sku;

    variantSkuResult = VariantSKU.from(sku);
    if (variantSkuResult.isFailure)
      throw new FailedToLoadVariantBySkuException(
        sku,
        variantSkuResult.error.message
      );
    let vsku: VariantSKU = variantSkuResult.value();
    let loadVariantResult = await this._repo.findBySku(vsku);
    let variant: ProductVariant = null;
    if (loadVariantResult.isFailure) {
      loadVariantResult = await this._syncVariant.execute(dto);
      if (loadVariantResult.isFailure) {
        throw new FailedToLoadVariantBySkuException(
          dto.sku,
          loadVariantResult.error.message
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
    return catalogVariant;
  }
  async loadVariantById(
    dto: LoadLineItemVariantByIdDto
  ): Promise<CatalogVariant> {
    try {
      let vidResult: Result<any> = null;

      vidResult = ProductVariantUUID.from(dto.id);
      if (vidResult.isFailure) throw vidResult.error;
      let variantId: ProductVariantUUID = vidResult.value();
      let loadVariantResult = await this._repo.findById(variantId);
      let variant: ProductVariant = null;
      if (loadVariantResult.isFailure) {
        throw new FailedToLoadVariantByIdException(
          dto.id,
          loadVariantResult.error.message
        );
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
      return catalogVariant;
    } catch (error) {
      throw error;
    }
  }
}

export class CatalogServiceException extends InternalServerErrorException {
  public type: CatalogServiceError;
  constructor(objectOrError: any, description: string) {
    super(objectOrError, description);
  }
}
export class FailedToLoadVariantBySkuException extends CatalogServiceException {
  constructor(id: string, error: any) {
    const msg = `Failed to load ProductVariant with SKU '${id}': ${
      error?.message || error
    }`;
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: msg,
        timestamp: moment().toDate(),
        error: CatalogServiceError.FailedToLoadVariant,
        details: { id, inner: [error] },
      },
      msg
    );
  }
}

export class FailedToLoadVariantByIdException extends CatalogServiceException {
  constructor(id: string, error: any) {
    const msg = `Failed to load ProductVariant with ID '${id}': ${
      error?.message || error
    }`;
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: msg,
        timestamp: moment().toDate(),
        error: CatalogServiceError.FailedToLoadVariant,
        details: { id, inner: [error] },
      },
      msg
    );
  }
}
