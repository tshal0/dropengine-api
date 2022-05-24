import { Injectable, Logger } from "@nestjs/common";
import moment from "moment";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Product } from "@catalog/model";
import { DbProduct, DbProductType } from "./entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import validator from "validator";
@Injectable()
export class ProductsRepository {
  private readonly logger: Logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectRepository(DbProduct)
    private readonly _products: EntityRepository<DbProduct>,
    @InjectRepository(DbProductType)
    private readonly _types: EntityRepository<DbProductType>
  ) {}

  /**
   * Persists the Product Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param entity Product Aggregate to be persisted.
   * @returns {Product>}
   */
  public async save(entity: Product): Promise<DbProduct> {
    let dbe: DbProduct = await this.lookupBySkuOrId(entity);

    if (!dbe) {
      dbe = await this.create(entity);
    } else {
      dbe = await this.update(dbe, entity);
    }

    const id = validator.isUUID(`${entity.productTypeId}`)
      ? entity.productTypeId
      : null;
    let productType = await this._types.findOne({
      $or: [{ name: entity.type }, { id }],
    });
    if (!productType) {
      throw new EntityNotFoundException(
        `ProductTypeNotFound`,
        `${entity.productTypeId}|${entity.type}`
      );
    }
    dbe.productType = productType;

    await this._products.persistAndFlush(dbe);
    return dbe;
  }

  /**
   * Looks up Product given an ID or SKU.
   * @param dto Params containing ID or SKU
   * @returns {DbProduct}
   */
  public async lookupBySkuOrId(dto: {
    id: string;
    sku: string;
  }): Promise<DbProduct> {
    const id = validator.isUUID(`${dto.id}`) ? dto.id : null;
    return await this._products.findOne(
      { $or: [{ id }, { sku: dto.sku }] },
      { populate: ["variants", "productType"] }
    );
  }

  public async create(entity: Product): Promise<DbProduct> {
    let dbe = new DbProduct();
    dbe = await this.update(dbe, entity);
    return await this._products.create(dbe);
  }

  public async update(target: DbProduct, source: Product): Promise<DbProduct> {
    target.sku = source.sku;
    target.image = source.image;
    target.type = source.type;
    target.pricingTier = source.pricingTier;
    target.tags = source.tags;
    target.image = source.image;
    target.svg = source.svg;
    target.personalizationRules = source.personalizationRules.map((r) =>
      r.raw()
    );
    return target;
  }

  public async query(): Promise<Product[]> {
    let dbProducts = await this._products.findAll({ populate: ["variants"] });

    let rawProps = dbProducts.map((p) => p.raw());
    let entities = rawProps.map((p) => new Product(p));
    return entities;
  }

  public async findById(id: string): Promise<DbProduct> {
    let dbe = await this._products.findOne({ id }, { populate: ["variants"] });
    if (dbe) {
      return await dbe;
    }
    return null;
  }
  public async findBySku(sku: string): Promise<DbProduct> {
    let dbe = await this._products.findOne({ sku }, { populate: ["variants"] });
    if (dbe) {
      return await dbe;
    }
    return null;
  }
  public async delete(id: string): Promise<any> {
    let dbe = await this._products.findOne(id);
    if (!dbe) {
      return { result: "NOT_FOUND", timestamp: moment().toDate() };
    }
    await this._products.removeAndFlush(dbe);
    return { result: "DELETED", timestamp: moment().toDate() };
  }
}
