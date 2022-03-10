export class CreateProductTypeDto {
  uuid?: string | undefined
  name: string;
  productionData: MetalArtManufacturingDetailsDto;
  option1: ProductTypeOptionDto;
  option2: ProductTypeOptionDto;
  option3: ProductTypeOptionDto;
  livePreview: LivePreviewDto;
}

export class LivePreviewDto {
  enabled: boolean;
  name: string;
  link: string;
  version: string;
}

export class MetalArtManufacturingDetailsDto {
  [key: string]: any;
  material: string;
  thickness: string;
  route: string;
}

export class ProductTypeOptionDto {
  name: string;
  values: ProductTypeVariantOptionDto[];
}
export class ProductTypeVariantOptionDto {
  name: string;
  value: string;
  enabled: boolean;
}
