import { ProductTypesRepository } from "@catalog/database";
import { IProductTypeProps, ProductType } from "@catalog/domain/model";
import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import { CreateProductTypeDto } from "..";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class ProductTypeService {
  private readonly logger: Logger = new Logger(ProductTypeService.name);

  constructor(private _repo: ProductTypesRepository) {}

  public async create(dto: CreateProductTypeDto): Promise<ProductType> {
    const now = moment().toDate();
    let props: IProductTypeProps = {
      id: dto.id,
      name: dto.name,
      image: dto.image,
      productionData: dto.productionData,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      livePreview: dto.livePreview,
      products: [],
      updatedAt: now,
      createdAt: now,
    };
    let toBeCreated = new ProductType(props);
    let result = await this._repo.save(toBeCreated);
    return result.toProductType();
  }
  public async query(): Promise<ProductType[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<ProductType> {
    const result = await this._repo.findById(id);
    return result.toProductType();
  }
  public async findByName(name: string): Promise<ProductType> {
    const result = await this._repo.findByName(name);
    return result.toProductType();
  }
  public async update(dto: CreateProductTypeDto): Promise<ProductType> {
    const now = moment().toDate();

    let toBeUpdated = await this._repo.findById(dto.id);
    if (!toBeUpdated) toBeUpdated = await this._repo.findByName(dto.name);
    if (!toBeUpdated) {
      return await this.create(dto);
    }
    let props: IProductTypeProps = {
      id: dto.id,
      name: dto.name,
      image: dto.image,
      productionData: dto.productionData,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      livePreview: dto.livePreview,
      products: [],
      updatedAt: now,
      createdAt: now,
    };
    let toBeSaved = new ProductType(props);
    let result = await this._repo.save(toBeSaved);
    return result.toProductType();
  }
  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }
}
