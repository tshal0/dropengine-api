import { ProductsRepository } from "@catalog/database";
import {
  IProductProps,
  PersonalizationRule,
  Product,
} from "@catalog/domain/model";
import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import { CreateProductDto } from "..";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(private _repo: ProductsRepository) {}

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
}
