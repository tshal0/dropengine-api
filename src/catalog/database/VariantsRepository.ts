import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Variant } from "@catalog/domain/model";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { ProductTypesRepository } from "./ProductTypesRepository";
import { ProductsRepository } from "./ProductsRepository";
import moment from "moment";

@Injectable()
export class VariantsRepository {
  private readonly logger: Logger = new Logger(VariantsRepository.name);

  constructor(
    private readonly _types: ProductTypesRepository,
    private readonly _products: ProductsRepository,
    @InjectRepository(DbProductVariant)
    private readonly _variants: EntityRepository<DbProductVariant>
  ) {}

  /**
   * Persists the Variant Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param entity Variant Aggregate to be persisted.
   * @returns {Variant>}
   */
  public async save(entity: Variant): Promise<DbProductVariant> {
    let creating = true;
    let dbe: DbProductVariant = await this.lookupBySkuOrId({
      id: entity.id,
      sku: entity.sku,
    });

    if (!dbe) {
      dbe = await this.create(entity);
    } else {
      creating = false;
      dbe = await this.update(dbe, entity);
    }

    if (creating) {
      let product = await this._products.lookupBySkuOrId({
        id: entity.product.id,
        sku: entity.product.sku,
      });
      let type = await this._types.lookupByNameOrId({
        id: entity.productType.id,
        name: entity.productType.name,
      });
      if (!product)
        throw new EntityNotFoundException(
          `ProductNotFound`,
          `${entity.productId}|${entity.sku}`
        );
      if (!type) {
        throw new EntityNotFoundException(
          `ProductTypeNotFound`,
          `${entity.productTypeId}|${entity.type}`
        );
      }
      dbe.product = product;
      dbe.productType = type;
    }

    await this._variants.persistAndFlush(dbe);
    return dbe;
  }

  public async create(entity: Variant): Promise<DbProductVariant> {
    let dbe = new DbProductVariant();
    dbe = await this.update(dbe, entity);
    return await this._variants.create(dbe);
  }
  public update(dbe: DbProductVariant, entity: Variant) {
    dbe.sku = entity.sku;
    dbe.image = entity.image;
    dbe.type = entity.type;

    dbe.option1 = entity.option1.raw();
    dbe.option2 = entity.option2.raw();
    dbe.option3 = entity.option3.raw();
    dbe.height = entity.height.raw();
    dbe.width = entity.width.raw();
    dbe.weight = entity.weight.raw();
    dbe.manufacturingCost = entity.manufacturingCost.raw();
    dbe.shippingCost = entity.shippingCost.raw();
    return dbe;
  }
  public async lookupBySkuOrId(dto: {
    id: string;
    sku: string;
  }): Promise<DbProductVariant> {
    if (!dto.id.length) dto.id = null;
    return await this._variants.findOne(
      { $or: [{ id: dto.id }, { sku: dto.sku }] },
      { populate: ["product", "productType"] }
    );
  }

  public async query(): Promise<Variant[]> {
    let dbVariants = await this._variants.findAll({});
    let variants = dbVariants.map((pt) => new Variant(pt.raw()));
    return variants;
  }

  public async findById(id: string): Promise<DbProductVariant> {
    let dbe = await this._variants.findOne(
      { id },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async findBySku(sku: string): Promise<DbProductVariant> {
    let dbe = await this._variants.findOne(
      { sku },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async delete(id: string): Promise<any> {
    let dbe = await this._variants.findOne(id);
    if (!dbe) {
      return { result: "NOT_FOUND", timestamp: moment().toDate() };
    }
    await this._variants.removeAndFlush(dbe);
    return { result: "DELETED", timestamp: moment().toDate() };
  }
}
