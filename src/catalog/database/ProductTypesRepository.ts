import { Injectable, Logger } from "@nestjs/common";
import moment from "moment";
import { EntityManager } from "@mikro-orm/postgresql";
import { EntityNotFoundException } from "@shared/exceptions";
import { ProductType } from "@catalog/domain/model";
import { DbProductType } from "./entities";

export class ProductTypeNotFoundException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductType not found with ID: ${id}`, id, `USER_NOT_FOUND`);
  }
}
export class ProductTypeNotFoundWithEmailException extends EntityNotFoundException {
  constructor(id: string) {
    super(`ProductType not found with Email: ${id}`, id, `USER_NOT_FOUND`);
  }
}

@Injectable()
export class ProductTypesRepository {
  private readonly logger: Logger = new Logger(ProductTypesRepository.name);

  constructor(private readonly em: EntityManager) {}

  public async delete(id: string): Promise<void> {
    let repo = this.em.getRepository(DbProductType);

    let mp = await repo.findOne(id);
    if (mp == null) {
      //TODO: ProductTypeNotFound
    }
    try {
      if (!mp.products.isInitialized()) {
        await mp.products.init();
      }
      for (const product of mp.products) {
        if (!product.variants.isInitialized()) {
          await product.variants.init();
        }
        product.variants.removeAll();
      }
      mp.products.removeAll();
      await repo.removeAndFlush(mp);
    } catch (error) {}
  }

  /**
   * Persists the ProductType Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param productType ProductType Aggregate to be persisted.
   * @returns {ProductType>}
   */
  public async save(productType: ProductType): Promise<DbProductType> {
    try {
      const props = productType.raw();
      let repo = this.em.getRepository(DbProductType);
      let weMustCreate = true;
      let dbe: DbProductType = null;
      if (productType.name.length) {
        dbe = await repo.findOne({ name: productType.name });
        if (dbe) weMustCreate = false;
      }
      if (productType.id) {
        dbe = await repo.findOne({ id: productType.id });
        if (dbe) weMustCreate = false;
      }
      if (!dbe) {
        dbe = new DbProductType();
      }
      dbe.name = props.name;
      dbe.image = props.image;
      dbe.productionData = props.productionData;
      dbe.option1 = props.option1;
      dbe.option2 = props.option2;
      dbe.option3 = props.option3;
      dbe.livePreview = props.livePreview;
      if (weMustCreate) {
        await repo.create(dbe);
      }

      await repo.persistAndFlush(dbe);

      return dbe;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async query(): Promise<ProductType[]> {
    try {
      let repo = this.em.getRepository(DbProductType);
      let dbProductTypes = await repo.findAll({ populate: ["products"] });

      let tasks = await dbProductTypes.map(async (pt) => pt.toProductType());
      let productTypes = await Promise.all(tasks);
      return productTypes;
    } catch (error) {
      //TODO: FailedToFindAllProductTypes
      this.logger.error(error);
      throw error;
    }
  }

  public async findById(id: string): Promise<DbProductType> {
    let repo = this.em.getRepository(DbProductType);
    let dbe = await repo.findOne({ id }, { populate: ["products"] });
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async findByName(name: string): Promise<DbProductType> {
    let repo = this.em.getRepository(DbProductType);
    let dbe = await repo.findOne({ name }, { populate: ["products"] });
    if (dbe) {
      return dbe;
    }
    return null;
  }
}
