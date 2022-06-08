import {
  DbProductType,
  DbProduct,
  DbProductVariant,
} from "@catalog/database/entities";
import {
  IProductProps,
  IProductTypeProps,
  IVariantProps,
  LivePreview,
  Product,
  ProductType,
  ProductTypes,
  ProductTypeSlugs,
  Variant,
} from "@catalog/model";
import { CatalogVariant } from "@catalog/services";
import { MyEasySuiteProductVariant } from "@myeasysuite/dto/MESProductVariant";
import { mockUuid1 } from "@sales/mocks";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";

export abstract class MESMetalArtMocks {
  static readonly PROD_TYPE = ProductTypes.MetalArt;
  static readonly PROD_TYPE_SLUG = ProductTypeSlugs.MetalArt;
  static readonly PSKU = `MU-C011-00`;
  static readonly VSKU = `${MESMetalArtMocks.PSKU}-12-Black`;

  static readonly IMAGE =
    "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png";

  static readonly SVG =
    "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg";

  static readonly metalArtVariant: MyEasySuiteProductVariant = {
    sku: "MU-C011-00-12-Black-Mild Steel-0.06-1",
    part_file_name: "MU-C011-00",
    material: "Mild Steel",
    thickness: "0.06",
    route_template_id: "1",
    product_variant_id: 4135624991,
    stock: 0,
    title: "Anchor Family Name - Steel Sign",
    vendor: "My Easy Monogram",
    categories:
      "Nautical Designs,Simple Products,For Her,Steel Monograms,All Custom",
    tags: "",
    image: MESMetalArtMocks.IMAGE,
    price: 28.5,
    width: null,
    height: null,
    weight: 352,
    option_1: "color",
    option_2: "size",
    option_3: null,
    base_price: 15,
    width_unit: "cm",
    height_unit: "cm",
    weight_unit: "oz",
    option_value_1: "Black",
    option_value_2: '12"',
    option_value_3: null,
    manufacturing_cost: "6.00",
    shipping_cost: "7.50",
    compared_at_price: 28.5,
    manufacturing_time: 106,
    updated_at: new Date("2021-05-12 11:30:36.000000"),
    svgs: [
      {
        url: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/8671382624/MU-C011-00.svg",
        name: "MU-C011-00.svg",
        created_at: new Date("2021-05-12 11:30:36.000000"),
      },
      {
        url: MESMetalArtMocks.SVG,
        name: "MU-C011-00.svg",
        created_at: new Date("2021-10-07 03:58:45.000000"),
      },
    ],
    customize_text: [
      {
        field_length: "16",
        field_pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
        field_type: "input",
        is_required: true,
        label: "Top Text",
        pattern_message: "A-Z 0-9 ( ) . ‘ & $ % # @ /",
        placeholder: "Enter up to 16 characters",
        option_list: "",
      },
      {
        field_length: "16",
        field_pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
        field_type: "input",
        is_required: true,
        label: "Bottom Text",
        pattern_message: "A-Z 0-9 ( ) . ‘ & $ % # @ /",
        placeholder: "Enter up to 16 characters",
        option_list: "",
      },
    ],
    is_visible: "Y",
    is_deleted: "N",
  };
  static readonly prodTypeProps: IProductTypeProps = {
    id: 1,
    name: MESMetalArtMocks.PROD_TYPE,
    slug: MESMetalArtMocks.PROD_TYPE_SLUG,
    image: "MOCK_IMG",
    productionData: {
      material: "Mild Steel",
      route: "1",
      thickness: "0.06",
    },
    option1: {
      enabled: true,
      name: "Size",
      values: [
        { enabled: true, value: '12"' },
        { enabled: true, value: '15"' },
        { enabled: true, value: '18"' },
      ],
    },
    option2: {
      enabled: true,
      name: "Color",
      values: [
        { enabled: true, value: "Black" },
        { enabled: true, value: "Gold" },
        { enabled: true, value: "Copper" },
      ],
    },
    option3: {
      enabled: false,
      name: "",
      values: [],
    },
    livePreview: new LivePreview().raw(),
    products: [],
    updatedAt: now,
    createdAt: now,
  };
  static readonly prodType: ProductType = new ProductType(
    MESMetalArtMocks.prodTypeProps
  );
  static readonly dbProdType: DbProductType = new DbProductType(
    MESMetalArtMocks.prodTypeProps
  );
  static readonly prodProps: IProductProps = {
    id: 1,
    sku: MESMetalArtMocks.PSKU,
    type: MESMetalArtMocks.PROD_TYPE,
    pricingTier: "2",
    tags: [],
    image: MESMetalArtMocks.IMAGE,
    svg: MESMetalArtMocks.SVG,
    personalizationRules: [
      {
        label: "Top Text",
        maxLength: 16,
        name: "top_text",
        options: "",
        pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
        placeholder: "Enter up to 16 characters",
        required: true,
        type: "input",
      },
      {
        label: "Bottom Text",
        maxLength: 16,
        name: "bottom_text",
        options: "",
        pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
        placeholder: "Enter up to 16 characters",
        required: true,
        type: "input",
      },
    ],
    variants: [],
    productType: cloneDeep(MESMetalArtMocks.prodTypeProps),
    updatedAt: now,
    createdAt: now,
  };
  static readonly prod: Product = new Product(MESMetalArtMocks.prodProps);
  static readonly dbProd: DbProduct = new DbProduct(MESMetalArtMocks.prodProps);
  static readonly vprops: IVariantProps = {
    id: 1,
    image: MESMetalArtMocks.IMAGE,
    sku: MESMetalArtMocks.VSKU,
    type: MESMetalArtMocks.PROD_TYPE,

    option1: { name: "Size", value: '12"' },
    option2: { name: "Color", value: "Black" },
    option3: { name: "", value: undefined },
    height: { dimension: 0, units: "mm" },
    width: { dimension: 0, units: "mm" },
    weight: { dimension: 352, units: "oz" },
    manufacturingCost: { total: 600, currency: "USD" },
    shippingCost: { total: 750, currency: "USD" },
    product: cloneDeep(MESMetalArtMocks.prodProps),
    productType: cloneDeep(MESMetalArtMocks.prodTypeProps),
  };
  static readonly variant: Variant = new Variant(MESMetalArtMocks.vprops);
  static readonly dbVariant: DbProductVariant = new DbProductVariant(
    MESMetalArtMocks.vprops
  );

  static readonly expected = {
    id: 1,
    height: {
      dimension: 0,
      units: "mm",
    },
    image:
      "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
    manufacturingCost: {
      currency: "USD",
      total: 600,
    },
    option1: {
      name: "Size",
      value: '12"',
    },
    option2: {
      name: "Color",
      value: "Black",
    },
    option3: {
      name: "",
      value: undefined,
    },
    product: {
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      id: 1,
      image:
        "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
      personalizationRules: cloneDeep(
        MESMetalArtMocks.prodProps.personalizationRules
      ),
      pricingTier: "2",
      productType: {
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        id: 1,
        name: MESMetalArtMocks.PROD_TYPE,
        slug: MESMetalArtMocks.PROD_TYPE_SLUG,
        image: "MOCK_IMG",
        livePreview: {
          enabled: false,
          link: "",
          name: "",
          version: "",
        },
        option1: {
          enabled: true,
          name: "Size",
          values: [
            {
              enabled: true,
              value: '12"',
            },
            {
              enabled: true,
              value: '15"',
            },
            {
              enabled: true,
              value: '18"',
            },
          ],
        },
        option2: {
          enabled: true,
          name: "Color",
          values: [
            {
              enabled: true,
              value: "Black",
            },
            {
              enabled: true,
              value: "Gold",
            },
            {
              enabled: true,
              value: "Copper",
            },
          ],
        },
        option3: {
          enabled: false,
          name: "",
          values: [],
        },
        productionData: {
          material: "Mild Steel",
          route: "1",
          thickness: "0.06",
        },
        products: [],
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      sku: "MU-C011-00",
      svg: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg",
      tags: [],
      type: ProductTypes.MetalArt,
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      variants: [],
    },
    productType: {
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      id: 1,
      name: MESMetalArtMocks.PROD_TYPE,
      slug: MESMetalArtMocks.PROD_TYPE_SLUG,
      image: "MOCK_IMG",
      livePreview: {
        enabled: false,
        link: "",
        name: "",
        version: "",
      },

      option1: {
        enabled: true,
        name: "Size",
        values: [
          {
            enabled: true,
            value: '12"',
          },
          {
            enabled: true,
            value: '15"',
          },
          {
            enabled: true,
            value: '18"',
          },
        ],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [
          {
            enabled: true,
            value: "Black",
          },
          {
            enabled: true,
            value: "Gold",
          },
          {
            enabled: true,
            value: "Copper",
          },
        ],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      productionData: {
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      },
      products: [],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
    },
    shippingCost: {
      currency: "USD",
      total: 750,
    },
    sku: "MU-C011-00-12-Black",
    type: "MetalArt",
    weight: {
      dimension: 352,
      units: "oz",
    },
    width: {
      dimension: 0,
      units: "mm",
    },
  };

  static readonly expectedCatalogVariant: CatalogVariant = {
    id: 1,
    height: { units: "mm", dimension: 0 },
    width: { units: "mm", dimension: 0 },
    sku: MESMetalArtMocks.VSKU,
    svg: MESMetalArtMocks.SVG,
    type: ProductTypes.MetalArt,
    image:
      "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
    manufacturingCost: {
      currency: "USD",
      total: 600,
    },
    option1: {
      name: "Size",
      value: '12"',
    },
    option2: {
      name: "Color",
      value: "Black",
    },
    option3: {
      name: "",
      value: undefined,
    },
    personalizationRules: cloneDeep(
      MESMetalArtMocks.prodProps.personalizationRules
    ),
    productionData: {
      material: "Mild Steel",
      route: "1",
      thickness: "0.06",
    },
    shippingCost: {
      currency: "USD",
      total: 750,
    },
    weight: {
      dimension: 352,
      units: "oz",
    },
  };
}
