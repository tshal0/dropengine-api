import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from "class-validator";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";
import { IProductTypeProps } from "@catalog/domain/model";

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
  enabled: boolean;
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

  productType?: IProductTypeProps;

  public static fromMyEasySuite(
    v: MyEasySuiteProductVariant
  ): CreateVariantDto {
    const option1 = {
      enabled: v.option_1?.length ? true : false,
      name: v.option_1,
      value: v.option_value_1,
    };
    const option2 = {
      enabled: v.option_2?.length ? true : false,
      name: v.option_2,
      value: v.option_value_2,
    };
    const option3 = {
      enabled: v.option_3?.length ? true : false,
      name: v.option_3,
      value: v.option_value_3,
    };
    const modifiedSku = v.sku?.split("-").slice(0, 5).join("-");
    let dto: CreateVariantDto = {
      productId: "",
      sku: modifiedSku,
      image: v.image,
      height: {
        units: v.height_unit as VariantDimensionUnits,
        dimension: v.height,
      },
      width: {
        units: v.width_unit as VariantDimensionUnits,
        dimension: v.width,
      },
      weight: {
        units: v.weight_unit as VariantWeightUnits,
        dimension: v.weight,
      },
      manufacturingCost: {
        currency: "USD",
        total: +v.manufacturing_cost * 100,
      },
      shippingCost: {
        currency: "USD",
        total: +v.shipping_cost * 100,
      },
      option1: option1,
      option2: option2,
      option3: option3,
      productSku: v.part_file_name,
    };
    return dto;
  }
}
