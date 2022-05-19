import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import csv from "csvtojson";
import { ProductsRepository, ProductTypesRepository } from "@catalog/database";
import {
  IProductProps,
  PersonalizationRule,
  Product,
} from "@catalog/domain/model";
import { CreateProductDto, CsvProductDto } from "@catalog/dto/Product";
import { compact, trim } from "lodash";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);
  constructor(private _repo: ProductsRepository) {}

  public async findAndUpdateOrCreate(dto: CreateProductDto): Promise<Product> {
    let props: IProductProps = {
      id: dto.id,
      sku: dto.sku,
      type: dto.type,
      productTypeId: dto.productTypeId,
      pricingTier: dto.pricingTier,
      tags: compact(dto.tags.split(",")),
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
      updatedAt: undefined,
      createdAt: undefined,
    };
    let toBeCreated = new Product(props);
    let result = await this._repo.save(toBeCreated);
    return new Product(result.raw());
  }
  public async query(): Promise<Product[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<Product> {
    let props = (await this._repo.findById(id)).raw();
    return new Product(props);
  }
  public async findBySku(sku: string): Promise<Product> {
    let props = (await this._repo.findBySku(sku)).raw();
    return new Product(props);
  }

  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: string): Promise<Product[]> {
    let csvResults: CreateProductDto[] = [];
    let savedResults: Product[] = [];
    const now = moment().toDate();
    let results: any[] = await csv().fromString(stream);
    csvResults = results.map((r) => CsvProductDto.create(r).toDto());
    // Process each batch of Products
    for (let i = 0; i < csvResults.length; i++) {
      const dto = csvResults[i];
      const product = this.generateProduct(dto, now);
      let saved = await this._repo.save(product);
      let raw = saved.raw();
      savedResults.push(new Product(raw));
    }
    return savedResults;
  }

  private generateProduct(dto: CreateProductDto, now: Date) {
    const rules = dto.personalizationRules.map(
      (r) => new PersonalizationRule(r)
    );
    const tags = dto.tags.split(",").map((t) => trim(t));
    return new Product({
      id: null,
      sku: dto.sku,
      type: dto.type,
      productTypeId: dto.productTypeId,
      pricingTier: dto.pricingTier,
      tags: tags,
      image: dto.image,
      svg: dto.svg,
      personalizationRules: rules,
      variants: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
