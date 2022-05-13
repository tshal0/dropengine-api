export interface IMyEasySuiteOrder {
  gateway: string;
  order_id: string;
  order_date: Date;
  order_number: string;
  order_source: string;
  order_correlation_id: string;
  order_status: string;
  customer_name: string;
  customer_email: string;
  financial_status: string;
  fulfillment_status: string;
  tracking_number: string;
  tracking_company: string;
  tracking_url: string;
  order_updated_at: Date;
  store: IMyEasySuiteStore;
  shipping_address: IMyEasySuiteShippingAddress;
  billing_address: IMyEasySuiteShippingAddress;
  line_items: IMyEasySuiteLineItem[];
  parts: IMyEasySuitePart[];
  flags: any[];
  manufacturer: string;
  manufacturer_code: string;
  shipstation_order_id: string;
  shipstation_order_key: string;
  shipstation_order_status: string;
  label: any;
}

export interface IMyEasySuiteLineItem {
  key: string;
  line_item_key: string;
  line_number: number;
  quantity: number;
  price: number;
  variant_sku: string;
  part_name: string;
  line_item_properties: IMyEasySuiteLineItemProperty[];
  product_variant: IMyEasySuiteProductVariant;
}

export interface IMyEasySuiteLineItemProperty {
  name: string;
  value: string;
}

export interface IMyEasySuiteProductVariant {
  svgs: IMyEasySuiteSVG[];
  customize_text: IMyEasySuiteCustomizeText[];
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
  tags: any;
  image: string;
  price: number;
  width: any;
  height: any;
  weight: number;
  option_1: string;
  option_2: string;
  option_3: any;
  base_price: number;
  width_unit: string;
  height_unit: string;
  weight_unit: string;
  option_value_1: string;
  option_value_2: string;
  option_value_3: any;
  manufacturing_cost: string;
  shipping_cost: string;
  compared_at_price: number;
  manufacturing_time: number;
  updated_at: Date;
  is_visible: string;
  is_deleted: string;
}

export interface IMyEasySuiteCustomizeText {
  field_length?: string;
  field_pattern: string;
  field_type: string;
  is_required: boolean;
  label: string;
  pattern_message?: string;
  placeholder: string;
  option_list?: string
}

export interface IMyEasySuiteSVG {
  url: string;
  name: string;
  created_at: Date;
}

export interface IMyEasySuitePart {
  events: IMyEasySuitePartEvent[];
  id: number;
  companyCode: string;
  orderId: string;
  importDate: Date;
  iteration: number;
  originalPartName: string;
  location: any;
  fulfilled: boolean;
  dateFulfilled: any;
  failed: boolean;
  dateFailed: any;
  imageUrl: any;
  routeTemplateId: number;
  routeTemplateName: string;
  stageId: number;
  stageName: string;
  workstationId: any;
  workstationName: any;
  nestId: any;
  nestName: any;
  productionOrderId: any;
  key: string;
  orderLineItemsCount: string;
  orderLineNumber: string;
  quantity: string;
  detail: string;
  partName: string;
  color: string;
  designVariant: any;
  size: string;
  materialSet: string;
  thickness: string;
  merchant: string;
  orderDate: Date;
  geoType: string;
  geoPath: string;
  orderNumber: string;
  shopifyOrderId: string;
  shipstationOrderId: any;
  shipstationOrderKey: any;
  itemName: string;
  partFile: string;
  projectSum: string;
  orderSum: string;
  detailOrderNumber: any;
  options: string;
  sku: string;
  companyRouteTemplateId: number;
  tags: string;
  priority: number;
  generatedPreviewImage: any;
}

export interface IMyEasySuitePartEvent {
  id: number;
  partId: number;
  partName: string;
  eventType: string;
  eventDetails: string;
  timestamp: Date;
  userEmail: string;
  event: string;
  companyCode: string;
  orderId: any;
}

export interface IMyEasySuiteShippingAddress {
  zip: string;
  city: string;
  name: string;
  phone: any;
  company: string;
  country: string;
  address1: string;
  address2: string;
  latitude: number;
  province: string;
  last_name: string;
  longitude: number;
  first_name: string;
  country_code: string;
  province_code: string;
}

export interface IMyEasySuiteStore {
  email: string;
  shop_origin: string;
  name: string;
}
