export interface IMESProductVariant {
  sku: string;
  part_file_name: string;
  material: string;
  thickness: string;
  route_template_id: string;
  product_variant_id: string;
  stock: string;
  title: string;
  vendor: string;
  categories: string;
  tags: string;
  image: string;
  price: number;
  width: number;
  height: number;
  weight: number;
  option_1: string;
  option_2: string;
  option_3: string;
  base_price: number;
  width_unit: string;
  height_unit: string;
  weight_unit: string;
  option_value_1: string;
  option_value_2: string;
  option_value_3: string;
  manufacturing_cost: string;
  shipping_cost: string;
  compared_at_price: number;
  manufacturing_time: number;
  updated_at: Date;
  svgs: IMESProductSvg[];
  customize_text: IMESProductCustomizeText[];
  is_visible: string;
  is_deleted: string;
}
export interface IMESProductSvg {
  url: string;
  name: string;
  created_at: Date;
}
export interface IMESProductCustomizeText {
  label: string;
  field_type: string;
  is_required: boolean;
  option_list?: string;
  field_length: string;
  placeholder: string;
  field_pattern: string;
  pattern_message: string;
}
