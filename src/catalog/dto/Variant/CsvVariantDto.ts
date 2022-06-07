import { Result } from "@shared/domain";
import { compact, toNumber } from "lodash";
import {
  CreateVariantDto,
  VariantDimensionUnits,
  VariantWeightUnits,
} from "./CreateVariantDto";

export interface ICsvProductVariantDto {
  ProductId: string;
  ProductSku: string;
  VariantId: string;
  VariantSku: string;
  Option1Value: string;
  Option2Value: string;
  Option3Value: string;
  VariantImage: string;
  DimensionUnits: string;
  HeightValue: number;
  WidthValue: number;
  WeightUnits: string;
  WeightValue: number;
  Currency: string;
  ManufacturingCost: number;
  ShippingCost: number;
  TotalCost: number;
}

export class CsvProductVariantDto {
  private constructor(private _props: ICsvProductVariantDto) {}
  public get props(): ICsvProductVariantDto {
    return Object.seal({ ...this._props });
  }
  public static create(dto: ICsvProductVariantDto) {
    return new CsvProductVariantDto(dto);
  }
  public static optionDisabled(o: any) {
    return [null, undefined, "", 0, false].includes(o?.length);
  }
  public toDto(): CreateVariantDto {
    try {
      const o1Disabled = CsvProductVariantDto.optionDisabled(
        this._props.Option1Value
      );
      const o2Disabled = CsvProductVariantDto.optionDisabled(
        this._props.Option2Value
      );
      const o3Disabled = CsvProductVariantDto.optionDisabled(
        this._props.Option3Value
      );
      let dto = new CreateVariantDto();

      dto.productSku = this._props.ProductSku;

      dto.id = +this._props.VariantId;
      dto.sku = this._props.VariantSku;

      dto.image = this._props.VariantImage;
      dto.height = {
        dimension: toNumber(this._props.HeightValue),
        units: this._props.DimensionUnits as VariantDimensionUnits,
      };
      dto.width = {
        dimension: toNumber(this._props.WidthValue),
        units: this._props.DimensionUnits as VariantDimensionUnits,
      };
      dto.weight = {
        dimension: toNumber(this._props.WeightValue),
        units: this._props.WeightUnits as VariantWeightUnits,
      };
      dto.manufacturingCost = {
        currency: this._props.Currency as any,
        total: toNumber(this._props.ManufacturingCost) * 100,
      };
      dto.shippingCost = {
        currency: this._props.Currency as any,
        total: toNumber(this._props.ShippingCost) * 100,
      };
      dto.option1 = {
        name: null,
        value: this._props.Option1Value,
      };
      dto.option2 = {
        name: null,
        value: this._props.Option2Value,
      };
      dto.option3 = {
        name: null,
        value: this._props.Option3Value,
      };
      return dto;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
