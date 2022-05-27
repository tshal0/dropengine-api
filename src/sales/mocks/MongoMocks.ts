import { ProductTypes } from "@catalog/model";
import { CatalogVariant } from "@catalog/services";
import { ISalesOrderProps, OrderStatus, SalesOrder } from "@sales/domain";
import {
  ISalesLineItemProps,
  SalesLineItem,
} from "@sales/domain/model/SalesLineItem";
import { mockUuid1 } from "@sales/mocks";
import { Address, IAddress } from "@shared/domain";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";

export abstract class MongoMocks {
  static readonly addressProps: IAddress = {
    zip: "43844-9406",
    city: "Warsaw",
    name: "Tony Stark",
    phone: "2563472777",
    company: "MyEasySuite Inc.",
    country: "United States",
    address1: "19936 County Road 18",
    address2: "",
    address3: "",
    latitude: 40.2496938,
    province: "Ohio",
    lastName: "Stark",
    longitude: -82.1265222,
    firstName: "Tony",
    countryCode: "US",
    provinceCode: "OH",
  };
  static readonly address: Address = new Address(MongoMocks.addressProps);
  static readonly PROD_TYPE = ProductTypes.MetalArt;
  static readonly PSKU = `MU-C011-00`;
  static readonly VSKU = `${MongoMocks.PSKU}-12-Black`;
  static readonly IMAGE =
    "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png";

  static readonly SVG =
    "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg";

  static readonly lineItemProps: ISalesLineItemProps = {
    lineNumber: 1,
    quantity: 1,
    variant: cloneDeep({
      id: mockUuid1,
      productId: mockUuid1,
      productTypeId: mockUuid1,
      height: { units: "mm", dimension: 0 },
      width: { units: "mm", dimension: 0 },
      sku: MongoMocks.VSKU,
      svg: MongoMocks.SVG,
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
      personalizationRules: cloneDeep([
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
      ]),
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
    }),
    personalization: [
      { name: "Top Text", value: "Sample" },
      { name: "Bottom Text", value: "Sample" },
    ],
    flags: [],
  };
  static readonly lineItem: SalesLineItem = new SalesLineItem(
    cloneDeep(MongoMocks.lineItemProps)
  );
  static readonly mockMongoId = "000000000000000000000001";
  static readonly orderProps: ISalesOrderProps = {
    id: MongoMocks.mockMongoId,
    accountId: mockUuid1,
    orderName: "SLI-1001",
    orderNumber: 1001,
    orderDate: now,
    orderStatus: OrderStatus.OPEN,
    lineItems: [cloneDeep(MongoMocks.lineItemProps)],
    customer: { email: "sample@mail.com", name: "SampleCustomer" },
    merchant: {
      email: "merchant@mail.com",
      name: "Merchant",
      shopOrigin: "merchant.myshopify.com",
    },
    shippingAddress: cloneDeep(MongoMocks.addressProps),
    billingAddress: cloneDeep(MongoMocks.addressProps),
    updatedAt: now,
    createdAt: now,
    events: [],
  };
  static readonly order: SalesOrder = new SalesOrder(MongoMocks.orderProps);

  static readonly expectedOrderProps: ISalesOrderProps = {
    id: null,
    orderDate: now,
    orderName: "SLI-1001",
    orderNumber: 1001,
    orderStatus: OrderStatus.OPEN,
    accountId: mockUuid1,
    billingAddress: MongoMocks.addressProps,
    customer: {
      email: "sample@mail.com",
      name: "SampleCustomer",
    },
    merchant: {
      email: "merchant@mail.com",
      name: "Merchant",
      shopOrigin: "merchant.myshopify.com",
    },
    lineItems: [
      {
        flags: [],
        lineNumber: 1,
        personalization: [
          {
            name: "Top Text",
            value: "Sample",
          },
          {
            name: "Bottom Text",
            value: "Sample",
          },
        ],
        quantity: 1,
        variant: {
          id: mockUuid1,
          productId: mockUuid1,
          productTypeId: mockUuid1,
          height: { units: "mm", dimension: 0 },
          width: { units: "mm", dimension: 0 },
          sku: MongoMocks.VSKU,
          svg: MongoMocks.SVG,
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
          personalizationRules: cloneDeep([
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
          ]),
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
        },
      },
    ],
    shippingAddress: MongoMocks.addressProps,
    updatedAt: now,
    createdAt: now,
    events: [],
  };

  static readonly expectedCatalogVariant: CatalogVariant = {
    id: mockUuid1,
    productId: mockUuid1,
    productTypeId: mockUuid1,
    height: { units: "mm", dimension: 0 },
    width: { units: "mm", dimension: 0 },
    sku: MongoMocks.VSKU,
    svg: MongoMocks.SVG,
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
    personalizationRules: cloneDeep([
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
    ]),
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
