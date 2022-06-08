import { ProductTypesRepository } from "@catalog/database";
import {
  IProductTypeProps,
  LivePreview,
  ProductType,
  ProductTypes,
  ProductTypeSlugs,
} from "@catalog/model";
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
      name: ProductTypes[dto.name],
      slug: ProductTypeSlugs[dto.name],
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
  public async findById(id: number): Promise<ProductType> {
    const result = await this._repo.findById(id);
    return result ? new ProductType(result.raw()) : null;
  }
  public async findByName(name: string): Promise<ProductType> {
    const result = await this._repo.findByName(name);
    return result ? new ProductType(result.raw()) : null;
  }

  public async delete(id: number): Promise<any> {
    return await this._repo.delete(id);
  }

  public async createMetalArt() {
    let type = new ProductType({
      name: ProductTypes.MetalArt,
      slug: ProductTypeSlugs.MetalArt,
      option1: {
        enabled: true,
        name: "Size",
        values: [
          { enabled: true, value: '12"' },
          { enabled: true, value: '15"' },
          { enabled: true, value: '18"' },
          { enabled: true, value: '24"' },
          { enabled: true, value: '30"' },
        ],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [
          { enabled: true, value: "Black" },
          { enabled: true, value: "White" },
          { enabled: true, value: "Copper" },
          { enabled: true, value: "Gold" },
          { enabled: true, value: "Silver" },
        ],
      },
      option3: { enabled: false, name: null, values: [] },
      livePreview: null,
      productionData: null,
      image: "",
      id: null,
      products: [],
      createdAt: null,
      updatedAt: null,
    });
    return await this._repo.create(type);
  }
}
