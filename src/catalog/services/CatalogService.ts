import {
  ProductsRepository,
  ProductTypesRepository,
  VariantsRepository,
} from "@catalog/database";
import { Variant } from "@catalog/domain";
import {
  CreateProductDto,
  CreateVariantDto,
  PersonalizationRuleDto,
} from "@catalog/dto";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { sortBy } from "lodash";
import moment from "moment";
import { ProductService } from "./ProductService";
import { ProductTypeService } from "./ProductTypeService";
import { VariantService } from "./VariantService";

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

  public async loadVariantBySku(sku: string) {
    let variant = await this._variants.findBySku(sku);
    if (!variant) {
      variant = await this.syncVariant(sku);
    }
    return variant;
  }

  public async loadVariantById(id: string) {
    let variant = await this._variants.findById(id);
    return variant;
  }

  public async syncVariant(sku: string): Promise<Variant> {
    let mesVariant = await this._myEasySuite.getVariantBySku(sku);
    let type = await this._types.findByName("2DMetalArt");
    let productSku = mesVariant.part_file_name;
    let product = await this._products.findBySku(productSku);
    let variant = await this._variants.findBySku(sku);
    if (!product) {
      let cpdto = new CreateProductDto();
      cpdto.type = type.name;
      cpdto.sku = productSku;
      cpdto.pricingTier = "2";
      cpdto.tags = mesVariant.tags || "";
      cpdto.image = mesVariant.image;
      const sortedSvgs = sortBy(mesVariant.svgs, (s) => s.created_at).reverse();
      const svg = sortedSvgs.length ? sortedSvgs[0].url : "";
      cpdto.svg = svg;
      cpdto.personalizationRules = mesVariant.customize_text.map((c) => {
        const co: PersonalizationRuleDto = {
          name: c.label?.trim().replace(/\s/g, "_").toLowerCase(),
          label: c.label,
          placeholder: c.placeholder,
          required: c.is_required,
          type: c.field_type,
          maxLength: c.field_length ? +c.field_length : null,
          options: c.option_list,
          pattern: c.field_pattern,
          font: "",
        };
        return co;
      });
      product = await this._products.findAndUpdateOrCreate(cpdto);
    }
    if (!variant) {
      let vdto = CreateVariantDto.fromMyEasySuite(mesVariant);
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
