// import {
//   IProductProps,
//   IProductTypeProps,
//   IProductVariantProps,
//   ProductType,
// } from "@catalog/domain";
// import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";
// import { mockUuid1 } from "@sales/mocks";
// import { now } from "@shared/mocks";

// export const validProductSku = `MES-000-01`;
// export const validVariantSku = `${validProductSku}-18-Black`;
// const validMesCustomizeText = [
//   {
//     field_length: "16",
//     field_pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
//     field_type: "input",
//     is_required: true,
//     label: "Top Text",
//     pattern_message: "A-Z 0-9 ( ) . ‘ & $ % # @ /",
//     placeholder: "Enter up to 16 characters",
//     option_list: "",
//   },
//   {
//     field_length: "16",
//     field_pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
//     field_type: "input",
//     is_required: true,
//     label: "Bottom Text",
//     pattern_message: "A-Z 0-9 ( ) . ‘ & $ % # @ /",
//     placeholder: "Enter up to 16 characters",
//     option_list: "",
//   },
// ];
// const validMesSvgs = [
//   {
//     url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/8671382624/MU-C011-00.svg",
//     name: "MU-C011-00.svg",
//     created_at: now,
//   },
//   {
//     url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg",
//     name: "MU-C011-00.svg",
//     created_at: now,
//   },
// ];
// export const validMesVariant: MyEasySuiteProductVariant = {
//   sku: `${validVariantSku}-0.06-1`,
//   part_file_name: `${validProductSku}`,
//   material: "Mild Steel",
//   thickness: "0.06",
//   route_template_id: "1",
//   product_variant_id: 8698754978,
//   stock: 0,
//   title: "Anchor Family Name - Steel Sign",
//   vendor: "My Easy Monogram",
//   categories:
//     "Nautical Designs,Simple Products,For Her,Steel Monograms,All Custom",
//   tags: "",
//   image:
//     "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
//   price: 44,
//   width: null,
//   height: null,
//   weight: 908,
//   option_1: "color",
//   option_2: "size",
//   option_3: null,
//   base_price: 25.5,
//   width_unit: "cm",
//   height_unit: "cm",
//   weight_unit: "oz",
//   option_value_1: "Black",
//   option_value_2: '18"',
//   option_value_3: null,
//   manufacturing_cost: "6.50",
//   shipping_cost: "12.00",
//   compared_at_price: 44,
//   manufacturing_time: 140,
//   updated_at: now,
//   svgs: validMesSvgs,
//   customize_text: validMesCustomizeText,
//   is_visible: "Y",
//   is_deleted: "N",
// };
// export const validProductTypeName = "2DMetalArt";
// export const validProductType: IProductTypeProps = {
//   id: mockUuid1,
//   name: validProductTypeName,
//   image: "imageurl",
//   productionData: {
//     route: "1",
//     material: "Mild Steel",
//     thickness: "0.06",
//   },
//   option1: {
//     name: "Size",
//     enabled: true,
//     values: [
//       {
//         value: "12",
//         enabled: true,
//       },
//       {
//         value: "15",
//         enabled: true,
//       },
//       {
//         value: "18",
//         enabled: true,
//       },
//       {
//         value: "24",
//         enabled: true,
//       },
//       {
//         value: "30",
//         enabled: true,
//       },
//     ],
//   },
//   option2: {
//     name: "Color",
//     enabled: true,
//     values: [
//       {
//         value: "Black",
//         enabled: true,
//       },
//       {
//         value: "White",
//         enabled: true,
//       },
//       {
//         value: "Gold",
//         enabled: true,
//       },
//       {
//         value: "Copper",
//         enabled: true,
//       },
//       {
//         value: "Silver",
//         enabled: true,
//       },
//     ],
//   },
//   option3: null,
//   livePreview: {
//     link: null,
//     name: null,
//     enabled: false,
//     version: null,
//   },
//   updatedAt: now,
//   createdAt: now,
//   products: null,
// };

// export const validProduct: IProductProps = {
//   id: mockUuid1,
//   sku: validProductSku,
//   type: validProductTypeName,
//   pricingTier: "2",
//   tags: [""],
//   image:
//     "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C109-00-Copper.png",
//   svg: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/7747438832/7834775479/MU-C109-00.svg",
//   createdAt: now,
//   updatedAt: now,
//   customOptions: [
//     {
//       name: "top_text",
//       type: "input",
//       label: "Top Text",
//       options: "",
//       pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
//       required: true,
//       maxLength: 16,
//       placeholder: "Enter up to 16 characters",
//     },
//     {
//       name: "middle_text",
//       type: "input",
//       label: "Middle Text",
//       options: "",
//       pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
//       required: true,
//       maxLength: 14,
//       placeholder: "Enter up to 14 characters",
//     },
//     {
//       name: "bottom_text",
//       type: "input",
//       label: "Bottom Text",
//       options: "",
//       pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
//       required: true,
//       maxLength: 16,
//       placeholder: "Enter up to 16 characters",
//     },
//     {
//       name: "initial",
//       type: "dropdownlist",
//       label: "Initial",
//       options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
//       required: true,
//       maxLength: null,
//       placeholder: "Select Initial",
//     },
//   ],
//   variants: [],
//   productType: null,
// };
// export const validProductVariant: IProductVariantProps = {
//   id: mockUuid1,
//   option1: {
//     name: "Size",
//     option: '15"',
//     enabled: true,
//   },
//   option2: {
//     name: "Color",
//     option: "Copper",
//     enabled: true,
//   },
//   option3: {
//     option: null,
//     enabled: false,
//     name: undefined,
//   },
//   image:
//     "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C109-00-Copper.png",
//   sku: "MU-C109-00-15-Copper",
//   height: {
//     units: "mm",
//     dimension: 0,
//   },
//   width: {
//     units: "mm",
//     dimension: 0,
//   },
//   weight: {
//     units: "oz",
//     dimension: 552,
//   },
//   manufacturingCost: {
//     total: 525,
//     currency: "USD",
//   },
//   shippingCost: {
//     total: 950,
//     currency: "USD",
//   },
//   createdAt: now,
//   updatedAt: now,
//   product: null,
// };
