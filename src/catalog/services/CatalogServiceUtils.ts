import { ProductTypes } from "@catalog/model";
import {
  CreateProductDto,
  CreateVariantDto,
  CreateVariantDtoDimension,
  CreateVariantDtoMoney,
  CreateVariantDtoWeight,
  PersonalizationRuleDto,
  VariantDimensionUnits,
  VariantWeightUnits,
} from "@catalog/dto";
import {
  IMyEasySuiteSVG,
  IMyEasySuiteCustomizeText,
} from "@myeasysuite/domain/IMyEasySuiteOrder";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";
import { sortBy, toLower, trim } from "lodash";

export function generateCategoryMap(categories: string[]) {
  return categories.reduce(
    (map, cat) => ((map[cat] = true), map),
    {} as { [key: string]: boolean }
  );
}

export function generateCategories(mesVariant: MyEasySuiteProductVariant) {
  let categories = mesVariant.categories.split(",");
  categories = categories.map((c) => {
    if (c.includes(ProductTypes.Jewelry)) return ProductTypes.Jewelry;
    if (c.includes(ProductTypes.Canvas)) return ProductTypes.Canvas;
    if (c.includes(ProductTypes.Steel)) return ProductTypes.MetalArt;
    else return c;
  });
  return categories;
}
export function determineProductType(mesVariant: MyEasySuiteProductVariant) {
  let categories = generateCategories(mesVariant);
  let cmap = generateCategoryMap(categories);
  let type: ProductTypes = ProductTypes.Uncategorized;
  if (cmap[ProductTypes.MetalArt]) type = ProductTypes.MetalArt;
  else if (cmap[ProductTypes.Canvas]) type = ProductTypes.Canvas;
  else if (cmap[ProductTypes.Jewelry]) type = ProductTypes.Jewelry;
  else if (cmap[ProductTypes.Wood]) type = ProductTypes.Wood;
  return type;
}
export function generateVariantFromMESVariant(
  variant: MyEasySuiteProductVariant
): CreateVariantDto {
  const option1 = {
    name: variant.option_1 || "",
    value: variant.option_value_1,
  };
  const option2 = {
    name: variant.option_2 || "",
    value: variant.option_value_2,
  };
  const option3 = {
    name: variant.option_3 || "",
    value: variant.option_value_3,
  };
  const modifiedSku = variant.sku?.split("-").slice(0, 5).join("-");

  const type = determineProductType(variant);
  let dto: CreateVariantDto = {
    productId: "",
    sku: modifiedSku,
    type: type,
    image: variant.image || "",
    height: getVariantHeight(variant),
    width: getVariantWidth(variant),
    weight: getVariantWeight(variant),
    manufacturingCost: getVariantManufacturingCost(variant),
    shippingCost: getVariantShippingCost(variant),
    option1: option1,
    option2: option2,
    option3: option3,
    productSku: variant.part_file_name,
  };
  return dto;
}

function getVariantShippingCost(
  variant: MyEasySuiteProductVariant
): CreateVariantDtoMoney {
  return {
    currency: "USD",
    total: +variant.shipping_cost * 100,
  };
}

function getVariantManufacturingCost(
  variant: MyEasySuiteProductVariant
): CreateVariantDtoMoney {
  return {
    currency: "USD",
    total: +variant.manufacturing_cost * 100,
  };
}

function getVariantWeight(
  variant: MyEasySuiteProductVariant
): CreateVariantDtoWeight {
  return {
    units: variant.weight_unit as VariantWeightUnits,
    dimension: variant.weight || 0,
  };
}

function getVariantWidth(
  variant: MyEasySuiteProductVariant
): CreateVariantDtoDimension {
  let dimension = +variant.width || 0;
  let units: VariantDimensionUnits = "mm";
  if (variant.width_unit == "cm") {
    dimension = dimension * 10;
  } else if (variant.width_unit == "in") {
    units = "in";
  }
  return {
    units: units,
    dimension: dimension,
  };
}

function getVariantHeight(
  variant: MyEasySuiteProductVariant
): CreateVariantDtoDimension {
  let dimension = +variant.height || 0;
  let units: VariantDimensionUnits = "mm";
  if (variant.height_unit == "cm") {
    dimension = dimension * 10;
  } else if (variant.height_unit == "in") {
    units = "in";
  }
  return {
    units: units,
    dimension: dimension,
  };
}

export function generateProductFromMESVariant(
  variant: MyEasySuiteProductVariant
) {
  let dto = new CreateProductDto();
  dto.sku = variant.part_file_name;
  dto.tags = variant.tags;
  dto.pricingTier = "2";
  dto.categories = variant.categories;
  dto.image = variant.image;
  dto.svg = extractLatestSvg(variant.svgs);
  dto.personalizationRules = extractRules(variant);
  dto.type = determineProductType(variant);
  dto.productTypeId = "";
  return dto;
}

export function extractRules(
  props: MyEasySuiteProductVariant
): PersonalizationRuleDto[] {
  return props?.customize_text?.map(convertToRule) || [];
}
export function extractLatestSvg(svgs: IMyEasySuiteSVG[]) {
  const sorted = sortBy(svgs, (s) => s.created_at).reverse();
  return sorted.length ? sorted[0].url : "";
}
export function convertToRule(c: IMyEasySuiteCustomizeText) {
  const name = extractName(c);
  const maxLength = calculateMaxLength(c);
  const co = new PersonalizationRuleDto();
  co.name = name;
  co.label = c.label;
  co.placeholder = c.placeholder;
  co.required = c.is_required;
  co.type = c.field_type;
  co.maxLength = maxLength;
  co.options = c.option_list;
  co.pattern = c.field_pattern;
  return co;
}
export function calculateMaxLength(c: IMyEasySuiteCustomizeText) {
  return c.field_length ? +c.field_length : null;
}

export function extractName(c: IMyEasySuiteCustomizeText) {
  return toLower(trim(c.label).replace(/\s/g, "_"));
}
