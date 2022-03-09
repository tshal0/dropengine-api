import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import csv from "csvtojson";
import { IProductVariantProps, Product, ProductSKU, ProductUUID } from "@catalog/domain";
import { ProductsRepository } from "@catalog/database/ProductsRepository";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { CreateProductVariantDto } from "@catalog/dto/CreateProductVariantDto";
import {
  CsvProductVariantDto,
} from "@catalog/dto/CsvProductVariantDto";

//TODO: Extract CsvProductDtos from stream, load into Products, save to DB
/**
 * Requirements:
 * 1. ImportProductVariantCsv must be able to create (if Id and Sku are empty).
 * 2. ImportProductVariantCsv must be able to update (if Id or Sku are filled).
 * 3. ImportProductVariantCsv must be able to create (if Sku is filled and NOT EXIST).
 */

export class ImportProductVariantResponse {
  constructor(
    public errors: ResultError[],
    public imported: IProductVariantProps[]
  ) {}
}

export interface IGroupedCsvVariants {
  [key: string]: CreateProductVariantDto[];
}

export class GroupedCsvVariants {
  constructor(protected props?: IGroupedCsvVariants | undefined) {
    if (!props) this.props = {};
  }
  public get(key: string) {
    this.init(key);
    return this.props[key];
  }
  public set(key: string, val: CreateProductVariantDto) {
    this.init(key);
    this.props[key].push(val);
    return this;
  }
  public keys() {
    return Object.keys(this.props);
  }

  private init(key: string) {
    if (!this.props[key]?.length) {
      this.props[key] = [];
    }
  }
}

export class ProcessImportedVariantsResponse {
  constructor(
    public loadResults: Result<Product>[],
    public importResults: Result<ProductVariant>[],
    public saveResults: Result<Product>[]
  ) {}
}

@Injectable({ scope: Scope.DEFAULT })
export class ImportProductVariantCsv implements UseCase<any, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: ProductsRepository
  ) {}
  get llog() {
    return `[${moment()}][${ImportProductVariantCsv.name}]`;
  }

  async execute(
    stream: Readable
  ): Promise<Result<ImportProductVariantResponse>> {
    const csvResults: Result<CreateProductVariantDto>[] = [];

    let variantsByProductSku: GroupedCsvVariants = new GroupedCsvVariants();
    let variantsByProductUuid: GroupedCsvVariants = new GroupedCsvVariants();

    try {
      const parser = csv();
      await parser.fromStream(stream).subscribe((obj) => {
        return new Promise(async (resolve, reject) => {
          let cpv = CsvProductVariantDto.create(obj);
          let result = cpv.toDto();
          if (result.isFailure) {
            csvResults.push(result);
            return resolve();
          }
          let dto = result.value();
          if (dto.uuid?.length) {
            variantsByProductUuid.set(dto.productUuid, dto);
          } else if (dto.productSku?.length) {
            variantsByProductSku.set(dto.productSku, dto);
          } else {
            //TODO: FailedToParseCsvProductVariantDto: No Identifier Found
          }

          return resolve();
        });
      });

      const productUuids = variantsByProductUuid.keys();
      const uuidResults = await this.processImportedVariantsByProductUuids(
        productUuids,
        variantsByProductUuid
      );

      const productSkus = variantsByProductSku.keys();
      const skuResults = await this.processImportedVariantsByProductSkus(
        productSkus,
        variantsByProductSku
      );
      const loadResults = uuidResults.loadResults.concat(
        skuResults.loadResults
      );
      const importResults = uuidResults.importResults.concat(
        skuResults.importResults
      );
      const saveResults = uuidResults.saveResults.concat(
        skuResults.saveResults
      );
      const mergedImportResults = new ProcessImportedVariantsResponse(
        loadResults,
        importResults,
        saveResults
      );

      const errors = [
        ...mergedImportResults.loadResults,
        ...mergedImportResults.saveResults,
        ...mergedImportResults.importResults,
        ...csvResults,
      ]
        .filter((r) => r.isFailure)
        .map((r) => r.error);
      const imported = mergedImportResults.importResults
        .filter((r) => r.isSuccess)
        .map((r) => r.value().props());
      let resp = new ImportProductVariantResponse(errors, imported);
      return Result.ok(resp);
    } catch (error) {
      //TODO: FailedToImportProductVariantCsv
      return Result.fail(new ResultError(error, null, {}));
    }
  }

  private async processImportedVariantsByProductSkus(
    skus: string[],
    variantsByProductSku: GroupedCsvVariants
  ): Promise<ProcessImportedVariantsResponse> {
    let loadResults: Result<Product>[] = await this.loadProductsBySku(skus);
    let products = loadResults.filter((r) => r.isSuccess).map((r) => r.value());
    let importResults: Result<ProductVariant>[] = [];
    let saveResults: Result<Product>[] = [];
    for (const product of products) {
      const sku = product.sku.value();
      let dtos = variantsByProductSku.get(sku);
      for (const variant of dtos) {
        let result = await product.importVariant(variant);
        importResults.push(result);
      }
      let saveResult = await this._repo.save(product);
      saveResults.push(saveResult);
    }
    return new ProcessImportedVariantsResponse(
      loadResults,
      importResults,
      saveResults
    );
  }

  //TODO: ImportProductVariantsResponse
  private async processImportedVariantsByProductUuids(
    uuids: string[],
    variantsByProductUuid: GroupedCsvVariants
  ): Promise<ProcessImportedVariantsResponse> {
    let loadResults: Result<Product>[] = await this.loadProductsByUuid(uuids);
    let products = loadResults.filter((r) => r.isSuccess).map((r) => r.value());
    let importResults: Result<ProductVariant>[] = [];
    let saveResults: Result<Product>[] = [];
    for (const product of products) {
      const puuid = product.uuid.value();
      let dtos = variantsByProductUuid.get(puuid);
      for (const variant of dtos) {
        let result = await product.importVariant(variant);
        importResults.push(result);
      }
      let saveResult = await this._repo.save(product);
      saveResults.push(saveResult);
    }
    return new ProcessImportedVariantsResponse(
      loadResults,
      importResults,
      saveResults
    );
  }

  private async loadProductsByUuid(productUuids: string[]) {
    let loadProductResults: Result<Product>[] = [];
    if (productUuids?.length) {
      loadProductResults = await Promise.all(
        await productUuids.map(
          async (uuid) =>
            await this._repo.loadByUuid(ProductUUID.from(uuid).value())
        )
      );
    }
    return loadProductResults;
  }

  private async loadProductsBySku(productSkus: string[]) {
    let loadProductResults: Result<Product>[] = [];
    if (productSkus?.length) {
      loadProductResults = await Promise.all(
        await productSkus.map(
          async (sku) => await this._repo.loadBySku(ProductSKU.from(sku))
        )
      );
    }
    return loadProductResults;
  }
}
