import { Result } from "@shared/domain";
import { compact, toNumber } from "lodash";
import {
  CreateProductVariantDto,
  VariantDimensionUnits,
  VariantWeightUnits,
} from "./CreateProductVariantDto";

export interface ICsvProductVariantDto {
  ProductId: string;
  ProductSku: string;
  ProductUuid: string;
  VariantUuid: string;
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
  public toDto(): Result<CreateProductVariantDto> {
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
      let dto = new CreateProductVariantDto();

      dto.productId = this._props.ProductUuid;
      dto.productSku = this._props.ProductSku;

      dto.id = this._props.VariantUuid;
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
        currency: this._props.Currency,
        total: toNumber(this._props.ManufacturingCost),
      };
      dto.shippingCost = {
        currency: this._props.Currency,
        total: toNumber(this._props.ShippingCost),
      };
      dto.option1 = {
        name: null,
        enabled: !o1Disabled,
        option: this._props.Option1Value,
      };
      dto.option2 = {
        name: null,
        enabled: !o2Disabled,
        option: this._props.Option2Value,
      };
      dto.option3 = {
        name: null,
        enabled: !o3Disabled,
        option: this._props.Option3Value,
      };
      return Result.ok(dto);
    } catch (error) {
      return Result.fail(error, this._props?.VariantSku);
    }
  }
}
