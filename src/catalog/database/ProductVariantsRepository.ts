import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Variant } from "@catalog/domain/model";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { ProductNotFoundException } from "./ProductsRepository";

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

  constructor(private readonly em: EntityManager) {}

  public async delete(id: string): Promise<void> {
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.findOne(id);
    if (!dbe) {
      //TODO: VariantNotFound
      return null;
    }
    return await repo.removeAndFlush(dbe);
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
      let repo = this.em.getRepository(DbProductVariant);
      let products = this.em.getRepository(DbProduct);
      let types = this.em.getRepository(DbProductType);
      let weMustCreate = true;
      let dbe: DbProductVariant = null;

      if (variant.sku.length) {
        dbe = await repo.findOne({ sku: variant.sku });
        if (dbe) weMustCreate = false;
      }
      if (variant.id) {
        dbe = await repo.findOne({ id: variant.id });
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
        let product = await products.findOne(
          {
            sku: productSku,
          },
          { populate: ["productType"] }
        );
        if (!product)
          product = await products.findOne(
            {
              id: productId,
            },
            { populate: ["productType"] }
          );
        if (!product)
          throw new ProductNotFoundException(`${productId}|${productSku}`);

        product.variants.add(dbe);
        let type = product.productType;
        type.variants.add(dbe);
        dbe.type = product.type;
      }

      await repo.persistAndFlush(dbe);

      return dbe.props();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async query(): Promise<Variant[]> {
    try {
      let repo = this.em.getRepository(DbProductVariant);
      let dbVariants = await repo.findAll({});

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
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.findOne(
      { id },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
  public async findBySku(sku: string): Promise<Variant> {
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.findOne(
      { sku },
      { populate: ["product", "productType"] }
    );
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
}
