import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from "class-validator";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";
import { IProductTypeProps } from "@catalog/model";

export type VariantDimensionUnits = "in" | "mm";

export class CreateVariantDtoDimension {
  @Type(() => Number)
  dimension: number;
  units: VariantDimensionUnits;
}

export type VariantWeightUnits = "g" | "oz";

export class CreateVariantDtoWeight {
  @Type(() => Number)
  dimension: number;
  units: VariantWeightUnits;
}

export class CreateVariantDtoOption {
  name: string;
  value: string;
}

export class CreateVariantDtoMoney {
  @Type(() => Number)
  total: number;
  currency: "USD";
}
export class CreateVariantDto {
  @IsOptional()
  id?: string | undefined;

  @IsNotEmpty()
  productId: string;
  @IsOptional()
  productSku?: string | undefined;

  @IsNotEmpty()
  sku: string;

  type: string;
  image: string;

  @Type(() => CreateVariantDtoDimension)
  height: CreateVariantDtoDimension;
  @Type(() => CreateVariantDtoDimension)
  width: CreateVariantDtoDimension;

  @Type(() => CreateVariantDtoWeight)
  weight: CreateVariantDtoWeight;

  @IsNotEmptyObject()
  @Type(() => CreateVariantDtoOption)
  option1?: CreateVariantDtoOption;
  @IsNotEmptyObject()
  @Type(() => CreateVariantDtoOption)
  option2?: CreateVariantDtoOption;
  option3?: CreateVariantDtoOption;

  @Type(() => CreateVariantDtoMoney)
  manufacturingCost?: CreateVariantDtoMoney;
  @Type(() => CreateVariantDtoMoney)
  shippingCost?: CreateVariantDtoMoney;
}
