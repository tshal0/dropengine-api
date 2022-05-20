import { Injectable, Logger } from "@nestjs/common";
import moment from "moment";
import { ProductType } from "@catalog/domain/model";
import { DbProductType } from "./entities";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { v4 as uuidV4, validate } from "uuid";

@Injectable()
export class ProductTypesRepository {
  private readonly logger: Logger = new Logger(ProductTypesRepository.name);

  constructor(
    @InjectRepository(DbProductType)
    private readonly _types: EntityRepository<DbProductType>
  ) {}

  /**
   * Persists the ProductType Aggregate.
   * - If SKU/UUID/ID is defined, attempts to Upsert.
   * - If EntityNotFound or SKU/UUID/ID not defined, attempts to Create.
   * @param entity ProductType Aggregate to be persisted.
   * @returns {ProductType>}
   */
  public async save(entity: ProductType): Promise<DbProductType> {
    let dbe: DbProductType = await this.lookupByNameOrId(entity);

    if (!dbe) {
      dbe = await this.create(entity);
    } else {
      dbe = await this.update(entity, dbe);
    }

    await this._types.persistAndFlush(dbe);

    return dbe;
  }

  public async create(entity: ProductType): Promise<DbProductType> {
    let dbe = new DbProductType();
    dbe = await this.update(entity, dbe);
    return await this._types.create(dbe);
  }
  public async update(
    entity: ProductType,
    dbe: DbProductType
  ): Promise<DbProductType> {
    dbe.name = entity.name;
    dbe.image = entity.image;
    dbe.productionData = entity.productionData.raw();
    dbe.option1 = entity.option1.raw();
    dbe.option2 = entity.option2.raw();
    dbe.option3 = entity.option3.raw();
    dbe.livePreview = entity.livePreview.raw();
    return dbe;
  }

  public async query(): Promise<ProductType[]> {
    let loaded = await this._types.findAll({
      populate: ["products"],
    });

    let entities = loaded.map((l) => new ProductType(l.raw()));
    return entities;
  }
  public async lookupByNameOrId(dto: {
    id: string;
    name: string;
  }): Promise<DbProductType> {
    if (!validate(dto.id)) dto.id = null;
    let dbe = await this._types.findOne(
      { $or: [{ id: dto.id }, { name: dto.name }] },
      { populate: ["products", "variants"] }
    );
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async findById(id: string): Promise<DbProductType> {
    let dbe = await this._types.findOne({ id }, { populate: ["products"] });
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async findByName(name: string): Promise<DbProductType> {
    let dbe = await this._types.findOne({ name }, { populate: ["products"] });
    if (dbe) {
      return dbe;
    }
    return null;
  }
  public async delete(id: string): Promise<any> {
    let productType = await this._types.findOne(id, {
      populate: ["products", "variants"],
    });
    if (!productType) {
      return { result: "NOT_FOUND", timestamp: moment().toDate() };
    }
    await this._types.removeAndFlush(productType);
    return { result: "DELETED", timestamp: moment().toDate() };
  }
}
