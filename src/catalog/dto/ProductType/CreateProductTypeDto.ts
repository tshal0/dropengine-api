export class CreateProductTypeDto {
  id?: string | undefined;
  name: string;
  image?: string | undefined;
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
  material: string;
  thickness: string;
  route: string;
}

export class ProductTypeOptionDto {
  enabled: boolean;
  name: string;
  values: ProductTypeVariantOptionDto[];
}
export class ProductTypeVariantOptionDto {
  value: string;
  enabled: boolean;
}
