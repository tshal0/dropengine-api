import { ProductType, ProductTypes, Variant } from "@catalog/domain";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import moment from "moment";
import { CatalogVariant, ICatalogVariant } from "./dto";
import {
  determineProductType,
  generateCategories,
  generateCategoryMap,
  generateProductFromMESVariant,
  generateVariantFromMESVariant,
} from "./CatalogServiceUtils";
import { ProductService } from "./ProductService";
import { ProductTypeService } from "./ProductTypeService";
import { VariantService } from "./VariantService";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";

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
    private _variants: VariantService,
    private _products: ProductService,
    private _types: ProductTypeService,
    private _myEasySuite: MyEasySuiteClient
  ) {}

  public async lookupVariantBySkuOrId(params: {
    id: string;
    sku: string;
  }): Promise<CatalogVariant> {
    let variant = await this._variants.lookup(params);
    if (!variant) {
      variant = await this.syncVariant(params.sku);
    }
    const props: ICatalogVariant = {
      id: variant.id,
      sku: variant.sku,
      image: variant.image,
      svg: variant.product.svg,
      type: variant.type,
      option1: variant.option1,
      option2: variant.option2,
      option3: variant.option3,
      productionData: variant.productType.productionData,
      personalizationRules: variant.product.personalizationRules,
      manufacturingCost: variant.manufacturingCost,
      shippingCost: variant.shippingCost,
      weight: variant.weight,
    };
    return new CatalogVariant(props);
  }

  public async syncVariant(sku: string): Promise<Variant> {
    let mesVariant = await this._myEasySuite.getVariantBySku(sku);

    let type: ProductTypes = determineProductType(mesVariant);
    let productType: ProductType = await this._types.findByName(type);

    // Validate ProductSKU
    let productSku = mesVariant.part_file_name;

    let product = await this._products.findBySku(productSku);
    let variant = await this._variants.findBySku(sku);
    if (!product) {
      let cpdto = generateProductFromMESVariant(mesVariant);
      cpdto.type = productType.name;
      cpdto.sku = productSku;
      product = await this._products.findAndUpdateOrCreate(cpdto);
    }
    if (!variant) {
      let vdto = generateVariantFromMESVariant(mesVariant);
      vdto.type = productType.name;
      vdto.productSku = productSku;
      variant = await this._variants.findAndUpdateOrCreate(vdto);
    }
    return variant;
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
    const msg = `Failed to load Variant with SKU '${id}': ${
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
    const msg = `Failed to load Variant with ID '${id}': ${
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
