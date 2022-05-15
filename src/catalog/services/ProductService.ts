import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import { Readable } from "stream";
import csv from "csvtojson";
import { ProductsRepository, ProductTypesRepository } from "@catalog/database";
import {
  IProductProps,
  PersonalizationRule,
  Product,
  ProductType,
} from "@catalog/domain/model";
import { CreateProductDto, CsvProductDto } from "@catalog/dto/Product";
import { DbProduct, DbProductType } from "@catalog/database/entities";
import { trim } from "lodash";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);
  constructor(
    private _repo: ProductsRepository,
    private _types: ProductTypesRepository
  ) {}

  public async create(dto: CreateProductDto): Promise<Product> {
    const now = moment().toDate();
    let props: IProductProps = {
      id: dto.id,
      sku: dto.sku,
      type: dto.type,
      pricingTier: dto.pricingTier,
      tags: dto.tags.split(","),
      image: dto.image,
      svg: dto.svg,
      personalizationRules: dto.personalizationRules.map(
        (r) =>
          new PersonalizationRule({
            ...r,
            maxLength: r.maxLength || 0,
            options: r.options || "",
            pattern: r.pattern || "",
          })
      ),
      variants: [],
      updatedAt: now,
      createdAt: now,
    };
    let toBeCreated = new Product(props);
    let result = await this._repo.save(toBeCreated);
    return result;
  }
  public async query(): Promise<Product[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<Product> {
    return await this._repo.findById(id);
  }
  public async findBySku(sku: string): Promise<Product> {
    return await this._repo.findBySku(sku);
  }
  public async update(dto: CreateProductDto): Promise<Product> {
    const now = moment().toDate();

    let toBeUpdated = await this._repo.findById(dto.id);
    if (!toBeUpdated) toBeUpdated = await this._repo.findBySku(dto.sku);
    if (!toBeUpdated) {
      return await this.create(dto);
    }
    let props: IProductProps = {
      id: dto.id,
      sku: dto.sku,
      type: dto.type,
      pricingTier: dto.pricingTier,
      tags: dto.tags.split(","),
      image: dto.image,
      svg: dto.svg,
      personalizationRules: dto.personalizationRules.map(
        (r) =>
          new PersonalizationRule({
            ...r,
            maxLength: r.maxLength || 0,
            options: r.options || "",
            pattern: r.pattern || "",
          })
      ),
      variants: [],
      updatedAt: now,
      createdAt: now,
    };
    let toBeSaved = new Product(props);
    let result = await this._repo.save(toBeSaved);
    return result;
  }
  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: Readable): Promise<Product[]> {
    let csvResults: CreateProductDto[] = [];
    let savedResults: Product[] = [];
    const now = moment().toDate();
    try {
      const parser = csv();
      await parser.fromStream(stream).subscribe((obj) => {
        return new Promise(async (resolve, reject) => {
          let cp = CsvProductDto.create(obj);
          let dto = cp.toDto();
          csvResults.push(dto);
          return resolve();
        });
      });

      // Process each batch of Products
      for (let i = 0; i < csvResults.length; i++) {
        const dto = csvResults[i];
        const product = new Product({
          id: null,
          sku: dto.sku,
          type: dto.type,
          pricingTier: dto.pricingTier,
          tags: dto.tags.split(",").map((t) => trim(t)),
          image: dto.image,
          svg: dto.svg,
          personalizationRules: dto.personalizationRules.map(
            (r) => new PersonalizationRule(r)
          ),
          variants: [],
          createdAt: now,
          updatedAt: now,
        });
        let saved = await this._repo.save(product);
        savedResults.push(saved);
      }
      return savedResults;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
export class ImportProductResponse {
  constructor(public errors: Error[], public imported: IProductProps[]) {}
}
export interface IGroupedCsvProducts {
  [key: string]: CreateProductDto[];
}
export class GroupedCsvProducts {
  constructor(protected props?: IGroupedCsvProducts | undefined) {
    if (!props) this.props = {};
  }
  public get(key: string) {
    this.init(key);
    return this.props[key];
  }
  public set(key: string, val: CreateProductDto) {
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
export class ProcessImportedProductsResponse {
  constructor(
    public loadResults: ProductType[],
    public importResults: Product[],
    public saveResults: ProductType[]
  ) {}
}
