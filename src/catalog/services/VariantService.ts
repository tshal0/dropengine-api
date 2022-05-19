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
import { IVariantProps, Variant } from "@catalog/domain/model";
import { CsvProductVariantDto, CreateVariantDto } from "@catalog/dto";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { EntityNotFoundException } from "@shared/exceptions";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class VariantService {
  private readonly logger: Logger = new Logger(VariantService.name);

  constructor(
    private _repo: VariantsRepository,
    private _products: ProductsRepository,
    private _types: ProductTypesRepository,
    private _myEasySuite: MyEasySuiteClient
  ) {}

  public async findAndUpdateOrCreate(dto: CreateVariantDto): Promise<Variant> {
    let dbp = await this._products.findBySku(dto.productSku);
    if (!dbp) dbp = await this._products.findById(dto.productId);
    if (!dbp) {
      throw new EntityNotFoundException(
        `ProductNotFound`,
        `${dto.productId}|${dto.productSku}`
      );
    }
    let pt = await this._types.findById(dbp.productType.id);

    // TODO: Verify Variant is being created with valid Option values

    const productTypeOption1 = pt.option1?.name;
    const productTypeOption2 = pt.option2?.name;
    const productTypeOption3 = pt.option3?.name;

    if (productTypeOption1?.length && !dto.option1.name?.length)
      dto.option1.name = productTypeOption1;
    if (productTypeOption2?.length && !dto.option2.name?.length)
      dto.option2.name = productTypeOption2;
    if (productTypeOption3?.length && !dto.option3.name?.length)
      dto.option3.name = productTypeOption3;

    const dtoOptions = compact([dto.option1, dto.option2, dto.option3]).reduce(
      (map, n) => ((map[toLower(n.name)] = n.value), map),
      {} as { [key: string]: string }
    );
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

    let props: IVariantProps = {
      id: dto.id,
      image: dto.image,
      sku: dto.sku,
      type: dto.type,
      productId: dto.productId,
      productTypeId: null,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      height: dto.height,
      width: dto.width,
      weight: dto.weight,
      manufacturingCost: dto.manufacturingCost,
      shippingCost: dto.shippingCost,
    };
    let toBeCreated = new Variant(props);
    let result = await this._repo.save(toBeCreated);
    return result.entity();
  }
  public async query(): Promise<Variant[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<Variant> {
    return (await this._repo.findById(id)).entity();
  }
  public async findBySku(sku: string): Promise<Variant> {
    return (await this._repo.findBySku(sku)).entity();
  }
  public async update(dto: CreateVariantDto): Promise<Variant> {
    let toBeUpdated = await this._repo.findById(dto.id);
    if (!toBeUpdated) toBeUpdated = await this._repo.findBySku(dto.sku);
    if (!toBeUpdated) {
      return await this.findAndUpdateOrCreate(dto);
    }
    let props: IVariantProps = {
      id: dto.id,
      image: dto.image,
      sku: dto.sku,
      type: dto.type,
      productId: dto.productId,
      productTypeId: null,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      height: dto.height,
      width: dto.width,
      weight: dto.weight,
      manufacturingCost: dto.manufacturingCost,
      shippingCost: dto.shippingCost,
    };
    let toBeSaved = new Variant(props);
    let result = await this._repo.save(toBeSaved);
    return result.entity();
  }
  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: Readable): Promise<Variant[]> {
    let csvResults: CreateVariantDto[] = [];
    let savedResults: Variant[] = [];
    const now = moment().toDate();
    try {
      const parser = csv();
      await parser.fromStream(stream).subscribe((obj) => {
        return new Promise(async (resolve, reject) => {
          let cp = CsvProductVariantDto.create(obj);
          let dto = cp.toDto();
          csvResults.push(dto);
          return resolve();
        });
      });

      // Process each batch of Products
      for (let i = 0; i < csvResults.length; i++) {
        const dto = csvResults[i];
        let saved = await this.findAndUpdateOrCreate(dto);
        savedResults.push(saved);
      }
      return savedResults;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
