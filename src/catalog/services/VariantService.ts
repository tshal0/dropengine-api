import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import { compact, toLower } from "lodash";
import { Readable } from "stream";
import csv from "csvtojson";
import {
  ProductsRepository,
  ProductTypesRepository,
  VariantsRepository,
} from "@catalog/database";
import {
  IProductTypeProps,
  IVariantProps,
  Variant,
} from "@catalog/model";
import { CsvProductVariantDto, CreateVariantDto } from "@catalog/dto";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { EntityNotFoundException } from "@shared/exceptions";
import { DbProductType } from "@catalog/database/entities";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class VariantService {
  private readonly logger: Logger = new Logger(VariantService.name);

  constructor(
    private _repo: VariantsRepository,
    private _products: ProductsRepository,
    private _types: ProductTypesRepository
  ) {}

  public async findAndUpdateOrCreate(dto: CreateVariantDto): Promise<Variant> {
    let product = await this._products.lookupBySkuOrId({
      id: dto.productId,
      sku: dto.productSku,
    });
    if (!product) {
      throw new EntityNotFoundException(
        `ProductNotFound`,
        `${dto.productId}|${dto.productSku}`
      );
    }
    let productType = await this._types.lookupByNameOrId({
      id: product.productType.id,
      name: dto.type,
    });
    dto = this.swapVariantOptions(productType.raw(), dto);

    let props: IVariantProps = {
      id: dto.id,
      image: dto.image,
      sku: dto.sku,
      type: productType.name,
      productId: product.id,
      productTypeId: productType.id,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      height: dto.height,
      width: dto.width,
      weight: dto.weight,
      manufacturingCost: dto.manufacturingCost,
      shippingCost: dto.shippingCost,
      product: product.raw(),
      productType: productType.raw(),
    };
    let toBeCreated = new Variant(props);
    let result = await this._repo.save(toBeCreated);
    const vprops = result.raw();
    return new Variant(vprops);
  }
  public swapVariantOptions(
    pt: IProductTypeProps,
    dto: CreateVariantDto
  ): CreateVariantDto {
    const productTypeOption1 = pt.option1.name;
    const productTypeOption2 = pt.option2.name;
    const productTypeOption3 = pt.option3.name;

    dto = adjustInvalidOptionNames(dto, pt);
    // VariantOptions: Color: Black, Size: 12
    // VariantOptions: null: Black, null: 12
    const dtoOptions = compact([dto.option1, dto.option2, dto.option3]).reduce(
      (map, n) => ((map[toLower(n.name)] = n.value), map),
      {} as { [key: string]: string }
    );
    // FE PT option, set the variant option accordingly
    const optionNames = [
      productTypeOption1,
      productTypeOption2,
      productTypeOption3,
    ];
    const optionMap = optionNames.reduce(
      (map, n) => ((map[toLower(n)] = n), map),
      {} as { [key: string]: string }
    );
    Object.keys(optionMap).forEach((k) => {
      optionMap[k] = dtoOptions[k];
    });

    dto.option1.name = productTypeOption1;
    dto.option1.value = optionMap[toLower(productTypeOption1)];
    dto.option2.name = productTypeOption2;
    dto.option2.value = optionMap[toLower(productTypeOption2)];
    dto.option3.name = productTypeOption3;
    dto.option3.value = optionMap[toLower(productTypeOption3)];
    return dto;
  }

  public async query(): Promise<Variant[]> {
    return await this._repo.query();
  }
  public async lookup(params: { id: string; sku: string }) {
    const result = await this._repo.lookupBySkuOrId(params);
    return result ? new Variant(result.raw()) : null;
  }
  public async findById(id: string): Promise<Variant> {
    const result = await this._repo.findById(id);
    return result ? new Variant(result.raw()) : null;
  }
  public async findBySku(sku: string): Promise<Variant> {
    const result = await this._repo.findBySku(sku);
    return result ? new Variant(result.raw()) : null;
  }

  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: string): Promise<Variant[]> {
    let csvResults: CreateVariantDto[] = [];
    let savedResults: Variant[] = [];
    let results: any[] = await csv().fromString(stream);
    csvResults = results.map((r) => CsvProductVariantDto.create(r).toDto());

    // Process each batch of Products
    for (let i = 0; i < csvResults.length; i++) {
      const dto = csvResults[i];
      let saved = await this.findAndUpdateOrCreate(dto);
      savedResults.push(saved);
    }
    return savedResults;
  }
}
export function adjustInvalidOptionNames(
  dto: CreateVariantDto,
  pt: IProductTypeProps
): CreateVariantDto {
  const dtoOptions = [dto.option1, dto.option2, dto.option3];
  for (let i = 0; i < dtoOptions.length; i++) {
    const option = dtoOptions[i];
    if (!option.name) {
      let fitsInOp1 = pt.option1.values.find((v) => v.value == option.value);
      let fitsInOp2 = pt.option2.values.find((v) => v.value == option.value);
      let fitsInOp3 = pt.option3.values.find((v) => v.value == option.value);
      if (fitsInOp1) option.name = pt.option1.name;
      else if (fitsInOp2) option.name = pt.option2.name;
      else if (fitsInOp3) option.name = pt.option3.name;
      else option.name = "";
    }
  }
  return dto;
}
