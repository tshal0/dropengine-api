import { ProductTypesRepository } from "@catalog/database";
import { IProductTypeProps, ProductType } from "@catalog/domain/model";
import { Injectable, Logger, Scope } from "@nestjs/common";
import { CreateProductTypeDto } from "..";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class ProductTypeService {
  private readonly logger: Logger = new Logger(ProductTypeService.name);

  constructor(private _repo: ProductTypesRepository) {}

  public async findAndUpdateOrCreate(
    dto: CreateProductTypeDto
  ): Promise<ProductType> {
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
      updatedAt: undefined,
      createdAt: undefined,
    };
    let toBeCreated = new ProductType(props);
    let result = await this._repo.save(toBeCreated);
    return new ProductType(result.raw());
  }
  public async query(): Promise<ProductType[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<ProductType> {
    const result = await this._repo.findById(id);
    return new ProductType(result.raw());
  }
  public async findByName(name: string): Promise<ProductType> {
    const result = await this._repo.findByName(name);
    return new ProductType(result.raw());
  }

  public async delete(id: string): Promise<any> {
    return await this._repo.delete(id);
  }
}
