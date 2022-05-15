import { Injectable, Logger } from "@nestjs/common";
import moment from "moment";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { Product } from "@catalog/domain/model";
import { DbProduct, DbProductType } from "./entities";
import { ProductTypeNotFoundException } from "./ProductTypesRepository";

export class ProductNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Product not found with ID: ${id}`, id, `PRODUCT_NOT_FOUND`);
  }
}
export class ProductNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`Product not found with SKU: ${id}`, id, `PRODUCT_NOT_FOUND`);
  }
}

@Injectable()
export class ProductsRepository {
  private readonly logger: Logger = new Logger(ProductsRepository.name);

  constructor(private readonly em: EntityManager) {}

  public async delete(id: string): Promise<void> {
    let repo = this.em.getRepository(DbProduct);
    let dbe = await repo.findOne(id);
    if (!dbe) {
      //TODO: ProductNotFound
      return null;
    }
    return await repo.removeAndFlush(dbe);
  }

  /**
   * Persists the Product Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param product Product Aggregate to be persisted.
   * @returns {Product>}
   */
  public async save(product: Product): Promise<Product> {
    try {
      const props = product.raw();
      let repo = this.em.getRepository(DbProduct);
      let types = this.em.getRepository(DbProductType);
      let weMustCreate = true;
      let dbe: DbProduct = null;
      if (product.sku.length) {
        dbe = await repo.findOne({ sku: product.sku });
        if (dbe) weMustCreate = false;
      }
      if (product.id) {
        dbe = await repo.findOne({ id: product.id });
        if (dbe) weMustCreate = false;
      }
      if (!dbe) {
        dbe = new DbProduct();
      }
      let productType = await types.findOne({ name: props.type });
      if (!productType) {
        //TODO: ProductTypeNotFound: InvalidProductTypeName
        throw new ProductTypeNotFoundException(props.type);
      }
      dbe.productType = productType;
      dbe.sku = props.sku;
      dbe.image = props.image;
      dbe.type = props.type;
      dbe.pricingTier = props.pricingTier;
      dbe.tags = props.tags;
      dbe.image = props.image;
      dbe.svg = props.svg;
      dbe.personalizationRules = props.personalizationRules;
      dbe.updatedAt = props.updatedAt;
      dbe.createdAt = props.createdAt;
      if (weMustCreate) {
        await repo.create(dbe);
      }

      await repo.persistAndFlush(dbe);

      return await dbe.toProduct();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async query(): Promise<Product[]> {
    try {
      let repo = this.em.getRepository(DbProduct);
      let dbProducts = await repo.findAll({ populate: ["variants"] });

      let tasks = await dbProducts.map(async (pt) => pt.toProduct());
      let productTypes = await Promise.all(tasks);
      return productTypes;
    } catch (error) {
      //TODO: FailedToFindAllProducts
      this.logger.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Product> {
    let repo = this.em.getRepository(DbProduct);
    let dbe = await repo.findOne({ id }, { populate: ["variants"] });
    if (dbe) {
      return await dbe.toProduct();
    }
    return null;
  }
  public async findBySku(sku: string): Promise<Product> {
    let repo = this.em.getRepository(DbProduct);
    let dbe = await repo.findOne({ sku }, { populate: ["variants"] });
    if (dbe) {
      return await dbe.toProduct();
    }
    return null;
  }
}
