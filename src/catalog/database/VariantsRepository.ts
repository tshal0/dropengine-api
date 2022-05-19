import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Variant } from "@catalog/domain/model";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";

export class VariantNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Variant not found with ID: ${id}`, id, `PRODUCT_NOT_FOUND`);
  }
}
export class VariantNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Variant not found with SKU: ${id}`, id, `PRODUCT_NOT_FOUND`);
  }
}

@Injectable()
export class VariantsRepository {
  private readonly logger: Logger = new Logger(VariantsRepository.name);

  constructor(
    @InjectRepository(DbProductType)
    private readonly _types: EntityRepository<DbProductType>,
    @InjectRepository(DbProduct)
    private readonly _products: EntityRepository<DbProduct>,
    @InjectRepository(DbProductVariant)
    private readonly _variants: EntityRepository<DbProductVariant>
  ) {}

  public async delete(id: string): Promise<void> {
    let dbe = await this._variants.findOne(id);
    if (!dbe) {
      //TODO: VariantNotFound
      return null;
    }
    return await this._variants.removeAndFlush(dbe);
  }

  /**
   * Persists the Variant Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param variant Variant Aggregate to be persisted.
   * @returns {Variant>}
   */
  public async save(variant: Variant): Promise<Variant> {
    try {
      const props = variant.raw();
      let weMustCreate = true;
      let dbe: DbProductVariant = null;

      if (variant.sku.length) {
        dbe = await this._variants.findOne({ sku: variant.sku });
        if (dbe) weMustCreate = false;
      }
      if (variant.id) {
        dbe = await this._variants.findOne({ id: variant.id });
        if (dbe) weMustCreate = false;
      }

      if (!dbe) {
        dbe = new DbProductVariant();
      }
      dbe.sku = props.sku;
      dbe.image = props.image;
      dbe.option1 = props.option1;
      dbe.option2 = props.option2;
      dbe.option3 = props.option3;
      dbe.height = props.height;
      dbe.width = props.width;
      dbe.weight = props.weight;
      dbe.manufacturingCost = props.manufacturingCost;
      dbe.shippingCost = props.shippingCost;

      if (weMustCreate) {
        let productId = props.productId;
        let productSku = props.sku?.split("-").slice(0, 3).join("-");
        let product = await this._products.findOne(
          {
            sku: productSku,
          },
          { populate: ["productType"] }
        );
        if (!product)
          product = await this._products.findOne(
            {
              id: productId,
            },
            { populate: ["productType"] }
          );
        if (!product)
          throw new EntityNotFoundException(
            `ProductNotFound`,
            `${variant.productId}|${variant.sku}`
          );

        product.variants.add(dbe);
        let type = product.productType;
        type.variants.add(dbe);
        dbe.type = product.type;
      }

      await this._variants.persistAndFlush(dbe);

      return dbe.props();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async query(): Promise<Variant[]> {
    try {
      let dbVariants = await this._variants.findAll({});

      let tasks = await dbVariants.map(async (pt) => pt.props());
      let productTypes = await Promise.all(tasks);
      return productTypes;
    } catch (error) {
      //TODO: FailedToFindAllVariants
      this.logger.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Variant> {
    let dbe = await this._variants.findOne(
      { id },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
  public async findBySku(sku: string): Promise<Variant> {
    let dbe = await this._variants.findOne(
      { sku },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
}
