import { VariantsRepository } from "@catalog/database";
import {
  IVariantProps,
  PersonalizationRule,
  Variant,
} from "@catalog/domain/model";
import { CreateVariantDto } from "@catalog/dto/Variant/CreateVariantDto";
import { Injectable, Logger, Scope } from "@nestjs/common";
import moment from "moment";
import { Readable } from "stream";
import csv from "csvtojson";
import { CsvProductVariantDto } from "..";

/**
 * Simple service for CRUD actions.
 */
@Injectable({ scope: Scope.DEFAULT })
export class VariantService {
  private readonly logger: Logger = new Logger(VariantService.name);

  constructor(private _repo: VariantsRepository) {}

  public async create(dto: CreateVariantDto): Promise<Variant> {
    let props: IVariantProps = {
      id: dto.id,
      image: dto.image,
      sku: dto.sku,
      productId: dto.productId,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      height: dto.height,
      width: dto.width,
      weight: dto.weight,
      manufacturingCost: dto.manufacturingCost,
      shippingCost: dto.shippingCost,
    };
    let toBeCreated = new Variant(props);
    let result = await this._repo.save(toBeCreated);
    return result;
  }
  public async query(): Promise<Variant[]> {
    return await this._repo.query();
  }
  public async findById(id: string): Promise<Variant> {
    return await this._repo.findById(id);
  }
  public async findBySku(sku: string): Promise<Variant> {
    return await this._repo.findBySku(sku);
  }
  public async update(dto: CreateVariantDto): Promise<Variant> {
    let toBeUpdated = await this._repo.findById(dto.id);
    if (!toBeUpdated) toBeUpdated = await this._repo.findBySku(dto.sku);
    if (!toBeUpdated) {
      return await this.create(dto);
    }
    let props: IVariantProps = {
      id: dto.id,
      image: dto.image,
      sku: dto.sku,
      productId: dto.productId,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      height: dto.height,
      width: dto.width,
      weight: dto.weight,
      manufacturingCost: dto.manufacturingCost,
      shippingCost: dto.shippingCost,
    };
    let toBeSaved = new Variant(props);
    let result = await this._repo.save(toBeSaved);
    return result;
  }
  public async delete(id: string): Promise<void> {
    return await this._repo.delete(id);
  }

  public async import(stream: Readable): Promise<Variant[]> {
    let csvResults: CreateVariantDto[] = [];
    let savedResults: Variant[] = [];
    const now = moment().toDate();
    try {
      const parser = csv();
      await parser.fromStream(stream).subscribe((obj) => {
        return new Promise(async (resolve, reject) => {
          let cp = CsvProductVariantDto.create(obj);
          let dto = cp.toDto();
          csvResults.push(dto);
          return resolve();
        });
      });

      // Process each batch of Products
      for (let i = 0; i < csvResults.length; i++) {
        const dto = csvResults[i];
        const product = new Variant({
          id: null,
          sku: dto.sku,
          productId: dto.productId,
          image: dto.image,
          option1: dto.option1,
          option2: dto.option2,
          option3: dto.option3,
          height: dto.height,
          width: dto.width,
          weight: dto.weight,
          shippingCost: dto.shippingCost,
          manufacturingCost: dto.manufacturingCost,
        });
        let saved = await this._repo.save(product);
        savedResults.push(saved);
      }
      return savedResults;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
