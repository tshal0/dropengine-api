import { IProductTypeProps } from "@catalog/domain/interfaces";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from "class-validator";

export type VariantDimensionUnits = "in" | "mm";

export class CreateProductVariantDtoDimension {
  @Type(() => Number)
  dimension: number;
  units: VariantDimensionUnits;
}

export type VariantWeightUnits = "g" | "oz";

export class CreateProductVariantDtoWeight {
  @Type(() => Number)
  dimension: number;
  units: VariantWeightUnits;
}

export class CreateProductVariantDtoOption {
  name: string;
  option: string;
  enabled: boolean;
}

export class CreateProductVariantDtoMoney {
  @Type(() => Number)
  total: number;
  currency: string;
}
export class CreateProductVariantDto {
  @IsOptional()
  uuid?: string | undefined;
  @IsOptional()
  id?: string | undefined;

  @IsNotEmpty()
  productUuid: string;
  @IsOptional()
  productSku?: string | undefined;

  @IsNotEmpty()
  sku: string;
  image: string;

  @Type(() => CreateProductVariantDtoDimension)
  height: CreateProductVariantDtoDimension;
  @Type(() => CreateProductVariantDtoDimension)
  width: CreateProductVariantDtoDimension;

  @Type(() => CreateProductVariantDtoWeight)
  weight: CreateProductVariantDtoWeight;

  @IsNotEmptyObject()
  @Type(() => CreateProductVariantDtoOption)
  option1?: CreateProductVariantDtoOption;
  @IsNotEmptyObject()
  @Type(() => CreateProductVariantDtoOption)
  option2?: CreateProductVariantDtoOption;
  option3?: CreateProductVariantDtoOption;

  @Type(() => CreateProductVariantDtoMoney)
  manufacturingCost?: CreateProductVariantDtoMoney;
  @Type(() => CreateProductVariantDtoMoney)
  shippingCost?: CreateProductVariantDtoMoney;

  productType?: IProductTypeProps;
}
