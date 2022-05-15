import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Variant } from "@catalog/domain/model";
import { DbProductVariant } from "./entities";

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
   * @param product Variant Aggregate to be persisted.
   * @returns {Variant>}
   */
  public async save(product: Variant): Promise<Variant> {
    try {
      const props = product.raw();
      let repo = this.em.getRepository(DbProductVariant);
      let weMustCreate = true;
      let dbe: DbProductVariant = null;
      if (product.sku.length) {
        dbe = await repo.findOne({ sku: product.sku });
        if (dbe) weMustCreate = false;
      }
      if (product.id) {
        dbe = await repo.findOne({ id: product.id });
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
        await repo.create(dbe);
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
    let dbe = await repo.findOne({ id });
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
  public async findBySku(sku: string): Promise<Variant> {
    let repo = this.em.getRepository(DbProductVariant);
    let dbe = await repo.findOne({ sku });
    if (dbe) {
      return await dbe.props();
    }
    return null;
  }
}
