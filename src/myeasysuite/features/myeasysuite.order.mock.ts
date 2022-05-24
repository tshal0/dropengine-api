import { IMyEasySuiteOrder } from "@myeasysuite/domain/IMyEasySuiteOrder";
import { now } from "@shared/mocks";

export const mockMesOrderId = "4478666801329";
export const mockMesOrderNumber = "762490";
export const mockMesOrderSource = "my_easy_monogram";
export const mockMesOrderCorrelationId = "4478666801329";
export const mockMesOrderCustomerName = "Amy Blades";
export const mockMesOrderCustomerEmail = "jbladesdvm@gmail.com";
export const mockMesOrderStore = {
  email: "Tance@southerndesigns.net",
  shop_origin: "metal-unlimited.myshopify.com",
  name: "Metal Unlimited",
};
const mockMesOrderShippingAddress = {
  zip: "65738",
  city: "Republic",
  name: "Amy Blades",
  phone: null,
  company: "",
  country: "United States",
  address1: "1221 West Lois Lane",
  address2: "",
  latitude: 37.1144606,
  province: "Missouri",
  last_name: "Blades",
  longitude: -93.5016285,
  first_name: "Amy",
  country_code: "US",
  province_code: "MO",
};
const mockMesLineItemSku = "MU-C109-00-15-Copper-Mild Steel-0.06-1";
const mockMesLineItemPartName = "4478666801329-1-1";
const mockMesLineItemProperties = [
  {
    name: "Top Text",
    value: "JESS & AMY",
  },
  {
    name: "Middle Text",
    value: "BLADES",
  },
  {
    name: "Bottom Text",
    value: "EST JUNE 7, 2003",
  },
  {
    name: "Initial",
    value: "B",
  },
];
const mockMesOrderManufacturer = "";
const mockMesOrderManufacturerCode = "";
const mockShipstationOrderKey = "156573514478666801329";
const mockShipstationOrderId = null;
export const mockMyEasySuiteOrder: IMyEasySuiteOrder = {
  gateway: "Shopify",
  order_id: mockMesOrderId,
  order_date: now,
  order_number: mockMesOrderNumber,
  order_source: mockMesOrderSource,
  order_correlation_id: mockMesOrderCorrelationId,
  order_status: "order_placed",
  customer_name: mockMesOrderCustomerName,
  customer_email: mockMesOrderCustomerEmail,
  financial_status: "paid",
  fulfillment_status: "unfulfilled",
  tracking_number: null,
  tracking_company: null,
  tracking_url: null,
  order_updated_at: now,
  store: mockMesOrderStore,
  shipping_address: mockMesOrderShippingAddress,
  line_items: [
    {
      key: "ORDER:762490-4478666801329:ITEMS:1:LINE:1:QTY:1",
      line_item_key: "11506605260977",
      line_number: 1,
      quantity: 1,
      price: 38.25,
      variant_sku: mockMesLineItemSku,
      part_name: mockMesLineItemPartName,
      line_item_properties: mockMesLineItemProperties,
      product_variant: {
        svgs: [
          {
            url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/7747438832/4532492879/MU-C109-00.svg",
            name: "MU-C109-00.svg",
            created_at: now,
          },
          {
            url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/7747438832/7834775479/MU-C109-00.svg",
            name: "MU-C109-00.svg",
            created_at: now,
          },
        ],
        customize_text: [
          {
            field_length: "16",
            field_pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            field_type: "input",
            is_required: true,
            label: "Top Text",
            pattern_message: "A-Z 0-9 ( ) . : - ‘ & $ % /",
            placeholder: "Enter up to 16 characters",
            option_list: "",
          },
          {
            field_length: "14",
            field_pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            field_type: "input",
            is_required: true,
            label: "Middle Text",
            pattern_message: "A-Z 0-9 ( ) . : - ‘ & $ % /",
            placeholder: "Enter up to 14 characters",
            option_list: "",
          },
          {
            field_length: "16",
            field_pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            field_type: "input",
            is_required: true,
            label: "Bottom Text",
            pattern_message: "A-Z 0-9 ( ) . : - ‘ & $ % /",
            placeholder: "Enter up to 16 characters",
            option_list: "",
          },
          {
            field_pattern: "",
            field_type: "dropdownlist",
            is_required: true,
            label: "Initial",
            placeholder: "Select Initial",
            option_list: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
          },
        ],
        sku: "MU-C109-00-15-Copper-Mild Steel-0.06-1",
        part_file_name: "MU-C109-00",
        material: "Mild Steel",
        thickness: "0.06",
        route_template_id: "1",
        product_variant_id: "8827434977",
        stock: "0",
        title: "Elaborate Split Letter Family Name - Steel Sign",
        vendor: "My Easy Monogram",
        categories: "Complex Products,Steel Monograms,All Custom,Best Sellers",
        tags: "",
        image:
          "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C109-00-Copper.png",
        price: 38.25,
        width: null,
        height: null,
        weight: 552,
        option_1: "color",
        option_2: "size",
        option_3: null,
        base_price: 23.5,
        width_unit: "cm",
        height_unit: "cm",
        weight_unit: "oz",
        option_value_1: "Copper",
        option_value_2: '15"',
        option_value_3: null,
        manufacturing_cost: "5.25",
        shipping_cost: "9.50",
        compared_at_price: 38.25,
        manufacturing_time: 159,
        updated_at: now,
        is_visible: "Y",
        is_deleted: "N",
      },
    },
  ],
  parts: [],
  flags: [],
  shipstation_order_id: mockShipstationOrderId,
  shipstation_order_key: mockShipstationOrderKey,
  billing_address: undefined,
  manufacturer: mockMesOrderManufacturer,
  manufacturer_code: mockMesOrderManufacturerCode,
  shipstation_order_status: "",
  label: undefined,
};
