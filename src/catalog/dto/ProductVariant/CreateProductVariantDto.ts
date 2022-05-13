import { IProductTypeProps } from "@catalog/domain/interfaces";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from "class-validator";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";

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
  id?: string | undefined;

  @IsNotEmpty()
  productId: string;
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

  public static fromMyEasySuite(
    v: MyEasySuiteProductVariant
  ): CreateProductVariantDto {
    const option1 = {
      enabled: v.option_1?.length ? true : false,
      name: v.option_1,
      option: v.option_value_1,
    };
    const option2 = {
      enabled: v.option_2?.length ? true : false,
      name: v.option_2,
      option: v.option_value_2,
    };
    const option3 = {
      enabled: v.option_3?.length ? true : false,
      name: v.option_3,
      option: v.option_value_3,
    };
    const modifiedSku = v.sku?.split("-").slice(0, 5).join("-");
    let dto: CreateProductVariantDto = {
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
