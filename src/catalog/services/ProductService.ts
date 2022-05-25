import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import csv from "csvtojson";
import { ProductsRepository, ProductTypesRepository } from "@catalog/database";
import { IProductProps, PersonalizationRule, Product } from "@catalog/model";
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
    const tags = dto.tags || "";
    let props: IProductProps = {
      id: dto.id,
      sku: dto.sku,
      type: dto.type,
      productTypeId: dto.productTypeId,
      pricingTier: dto.pricingTier,
      tags: compact(tags.split(",")),
      image: dto.image || "",
      svg: dto.svg || "",
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
    const result = await this._repo.findById(id);
    return result ? new Product(result.raw()) : null;
  }
  public async findBySku(sku: string): Promise<Product> {
    const result = await this._repo.findBySku(sku);
    return result ? new Product(result.raw()) : null;
  }

  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: string): Promise<Product[]> {
    let csvResults: CreateProductDto[] = [];
    let savedResults: Product[] = [];
    let results: any[] = await csv().fromString(stream);
    csvResults = results.map((r) => CsvProductDto.create(r).toDto());
    // Process each batch of Products
    for (let i = 0; i < csvResults.length; i++) {
      const dto = csvResults[i];
      let saved = await this.findAndUpdateOrCreate(dto);
      let raw = saved.raw();
      savedResults.push(new Product(raw));
    }
    return savedResults;
  }
}
