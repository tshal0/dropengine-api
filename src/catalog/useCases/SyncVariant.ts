import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { ProductsRepository } from "@catalog/database/ProductsRepository";
import {
  Product,
  ProductSKU,
  ProductType,
  ProductTypeName,
  ProductVariant,
  VariantSKU,
} from "@catalog/domain";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import {
  CreateProductDto,
  CreateProductVariantDto,
  CustomOptionDto,
  SyncVariantDto,
} from "@catalog/dto";
import {
  ProductTypesRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { sortBy } from "lodash";

export enum SyncVariantError {
  FailedToSyncVariant = "FailedToSyncVariant",
}

export class FailedToSyncVariantError implements ResultError {
  public stack: string;
  public name = SyncVariantError.FailedToSyncVariant;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: SyncVariantDto,
    public reason: string
  ) {
    this.message =
      `${SyncVariantError.FailedToSyncVariant}` + ` '${value.sku}': ${reason}`;
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class SyncVariant implements UseCase<SyncVariantDto, ProductVariant> {
  constructor(
    private _types: ProductTypesRepository,
    private _products: ProductsRepository,
    private _repo: ProductVariantsRepository,
    private _myEasySuite: MyEasySuiteClient
  ) {}
  get llog() {
    return `[${moment()}][${SyncVariant.name}]`;
  }

  async execute(dto: SyncVariantDto): Promise<Result<ProductVariant>> {
    let result: Result<any> = null;
    try {
      // Validate Variant SKU
      result = VariantSKU.from(dto.sku);
      if (result.isFailure) return Result.fail(result.error);
      let vsku: VariantSKU = result.value();

      // Load MES Variant
      let mesVariant = await this._myEasySuite.getVariantBySku(dto.sku);

      // Load 2DMetalArt ProductType
      result = await this.load2DMetalArtProductType();
      if (result.isFailure) return Result.fail(result.error);
      let type: ProductType = result.value();

      // Validate ProductSKU
      let partName = mesVariant.part_file_name;
      let psku = ProductSKU.from(partName);
      // Load Product (Create if Not Exist)
      let loadProductResult: Result<Product> = await this._products.load(
        psku,
        type
      );
      let product: Product = null;
      if (loadProductResult.isFailure) {
        // Create Product from MES Variant
        let cpdto = new CreateProductDto();
        cpdto.type = "2DMetalArt";
        cpdto.sku = partName;
        cpdto.pricingTier = "2";
        cpdto.tags = mesVariant.tags || "";
        cpdto.image = mesVariant.image;
        const sortedSvgs = sortBy(
          mesVariant.svgs,
          (s) => s.created_at
        ).reverse();
        cpdto.svg = sortedSvgs?.length ? sortedSvgs[0].url : "";
        cpdto.customOptions = mesVariant.customize_text.map((c) => {
          const co: CustomOptionDto = {
            name: c.label?.trim().replace(/\s/g, "_").toLowerCase(),
            label: c.label,
            placeholder: c.placeholder,
            required: c.is_required,
            type: c.field_type,
            maxLength: c.field_length ? null : +c.field_length,
            options: c.option_list,
            pattern: c.field_pattern,
          };
          return co;
        });
        // ImportProduct (Unsaved)
        let importProductResult = type.importProduct(cpdto);
        if (importProductResult.isFailure) {
          // TODO: FailedToImportProduct
          return Result.fail(failedToImportProduct(importProductResult, dto));
        }
        let productId = importProductResult.value().id;
        // SaveChanges
        let typeResult = await this._types.save(type);
        if (typeResult.isFailure) {
          return Result.fail(failedToSaveProduct(typeResult, dto));
        }
        // Load Newly Created Product
        loadProductResult = await this._products.load(productId, type);
        if (loadProductResult.isFailure) {
          return Result.fail(failedToLoadProduct(loadProductResult, dto));
        }
      }
      product = loadProductResult.value();
      // Load Variant By SKU
      let loadVariantResult = await this._repo.findBySku(vsku);
      let variant: ProductVariant = null;
      if (loadVariantResult.isFailure) {
        // Create Variant from MES Variant
        let vdto = CreateProductVariantDto.fromMyEasySuite(mesVariant);
        // Import Variant
        let importVariantResult = product.importVariant(vdto);
        if (importVariantResult.isFailure) {
          return Result.fail(failedToImportVariant(importVariantResult, dto));
        }

        const importedVariant = importVariantResult.value();
        let variantId = importedVariant.value().id;

        // SaveChanges
        let saveProductResult = await this._products.save(product);
        if (saveProductResult.isFailure) {
          return Result.fail(failedToSaveVariant(saveProductResult, dto));
        }
        // LoadVariantById
        loadVariantResult = await this._repo.findById(variantId);
        if (loadVariantResult.isFailure) {
          return Result.fail(failedToLoadVariant(loadVariantResult, dto));
        }
      }
      variant = loadVariantResult.value();
      return Result.ok(variant);
    } catch (error) {
      return Result.fail(error);
    }
  }

  private async load2DMetalArtProductType(): Promise<Result<ProductType>> {
    let typeName = ProductTypeName.from("2DMetalArt").value();
    let productTypeResult = await this._types.load(typeName);
    if (productTypeResult.isFailure) {
      return Result.fail(productTypeResult.error);
    }
    let type = productTypeResult.value();
    return Result.ok(type);
  }
}
function failedToImportProduct(
  result: Result<Product>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToImportProduct`
  );
}
function failedToSaveProduct(
  result: Result<ProductType>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToSaveProduct`
  );
}
function failedToLoadProduct(
  result: Result<Product>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToLoadProduct`
  );
}
function failedToImportVariant(
  result: Result<ProductVariant>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToImportVariant`
  );
}
function failedToSaveVariant(
  result: Result<Product>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToSaveVariant`
  );
}

function failedToLoadVariant(
  result: Result<ProductVariant>,
  dto: SyncVariantDto
): ResultError {
  return new FailedToSyncVariantError(
    [result.error],
    dto,
    `FailedToLoadVariant`
  );
}
