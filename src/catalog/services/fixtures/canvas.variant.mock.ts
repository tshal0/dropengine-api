import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";

export const canvasVariant: MyEasySuiteProductVariant = {
  sku: "MEM-504-00-24-Default-Foamboard-0.25-11",
  part_file_name: "MEM-504-00",
  material: "Foamboard",
  thickness: "0.25",
  route_template_id: "11",
  product_variant_id: 1581559541,
  stock: 0,
  title: "Bear Family - Framed Print",
  vendor: "My Easy Monogram",
  categories: "New Arrivals,Wildlife Collection,Printed Canvas",
  tags: null,
  image:
    "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MEM-504-00.png",
  price: 35,
  width: null,
  height: null,
  weight: 200,
  option_1: "color",
  option_2: "size",
  option_3: null,
  base_price: 17,
  width_unit: "cm",
  height_unit: "cm",
  weight_unit: "oz",
  option_value_1: "Default",
  option_value_2: '24"',
  option_value_3: null,
  manufacturing_cost: "6.0",
  shipping_cost: "12.0",
  compared_at_price: 35,
  manufacturing_time: null,
  updated_at: new Date("2022-05-05 07:46:07.000000"),
  svgs: [
    {
      url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/5369492493/1581559541/MEM-504-00.svg",
      name: "MEM-504-00.svg",
      created_at: new Date("2022-05-05 07:59:03.000000"),
    },
  ],
  customize_text: [
    {
      field_length: "",
      field_pattern: "",
      field_type: "dropdownlist",
      is_required: true,
      label: "Cubs",
      placeholder: "How many cubs?",
      option_list: "1 Cub,2 Cubs,3 Cubs,4 Cubs,5 Cubs,6 Cubs",
      pattern_message: undefined,
    },
    {
      field_length: "30",
      field_pattern: "",
      field_type: "input",
      is_required: true,
      label: "Top Text",
      placeholder: "Enter up to 30 characters",
      pattern_message: undefined,
    },
    {
      field_length: "40",
      field_pattern: "",
      field_type: "input",
      is_required: true,
      label: "Middle Text",
      placeholder: "Enter up to 40 characters",
      pattern_message: undefined,
    },
    {
      field_length: "40",
      field_pattern: "",
      field_type: "input",
      is_required: true,
      label: "Bottom Text",
      placeholder: "Enter up to 40 characters",
      pattern_message: undefined,
    },
  ],
  is_visible: "Y",
  is_deleted: "N",
};
