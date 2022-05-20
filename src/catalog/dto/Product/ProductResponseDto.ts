import {
  IDimension,
  IMoney,
  IProductProps,
  IWeight,
} from "@catalog/domain/model";

export class ProductTypeVariantOption {
  name: string;
  option: string;
  enabled: boolean;
}

export class ProductResponsePersonalizationRule {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  maxLength?: number;
  pattern?: string;
  options?: string;
}
export class ProductResponseProductVariant {
  uuid: string;
  sku: string;
  image: string;
  height: IDimension;
  width: IDimension;
  weight: IWeight;
  option1?: ProductTypeVariantOption;
  option2?: ProductTypeVariantOption;
  option3?: ProductTypeVariantOption;
  manufacturingCost?: IMoney;
  shippingCost?: IMoney;

  createdAt: Date;
  updatedAt: Date;
}
export class ProductResponseProductTypeOption {
  [key: string]: any;
  name: string;
  values: {
    [key: string]: any;
    name: string;
    value: string;
    enabled: boolean;
  }[];
}

export class ProductResponseProductType {
  uuid: string;
  name: string;
  productionData: {
    material: string;
    thickness: string;
    route: string;
  };
  option1: ProductResponseProductTypeOption;
  option2: ProductResponseProductTypeOption;
  option3: ProductResponseProductTypeOption;
  livePreview: {
    [key: string]: any;
    enabled: boolean;
    name: string;
    link: string;
    version: string;
  };
  updatedAt: Date;
  createdAt: Date;
}
export class ProductResponseDto {
  id: string;
  sku: string;
  type: string;
  pricingTier: string;
  tags: string[];
  image?: string;
  svg?: string;
  personalizationRules: ProductResponsePersonalizationRule[];
  variants?: ProductResponseProductVariant[];
  productType?: ProductResponseProductType;
  createdAt: Date;
  updatedAt: Date;

  public static from(props: IProductProps) {
    let dto = new ProductResponseDto();
    dto.id = props.id;
    dto.sku = props.sku;
    dto.type = props.type;
    dto.pricingTier = props.pricingTier;
    dto.tags = props.tags;
    dto.image = props.image;
    dto.svg = props.svg;

    dto.createdAt = props.createdAt;
    dto.updatedAt = props.updatedAt;

    // TODO: HandleCustomOptions
    dto.personalizationRules = props.personalizationRules?.map((co) => {
      let target = new ProductResponsePersonalizationRule();
      Object.assign(target, co);
      return target;
    });
    // TODO: HandleProductVariants
    dto.variants =
      props.variants?.map((co) => {
        let target = new ProductResponseProductVariant();
        Object.assign(target, co);
        return target;
      }) || [];
    // TODO: HandleProductType
    dto.productType = null;
    return dto;
  }
}
