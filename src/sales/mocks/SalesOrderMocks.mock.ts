import { ProductTypes } from "@catalog/model";
import { CatalogVariant } from "@catalog/services";
import { MongoSalesOrder } from "@sales/database/mongo";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import {
  OrderPlacedDetails,
  SalesOrderPlaced,
} from "../domain/events/OrderPlaced";
import { ISalesLineItemProps } from "../domain/model/SalesLineItem";
import {
  ISalesOrderProps,
  OrderStatus,
  SalesOrder,
} from "../domain/model/SalesOrder";
import { mockAddress } from "./mockAddress";
import { mockUuid1 } from "./mocks";
import { MongoMocks } from "./MongoMocks";
const PSKU = `MU-C011-00`;
const VSKU = `${PSKU}-12-Black`;

const SVG =
  "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg";

export abstract class SalesOrderMocks {
  /** ORDER PLACED */
  static readonly accountId = mockUuid1;
  static readonly orderName = "SLI-1001";
  static readonly orderDate = now;
  static readonly orderNumber = 1001;
  static readonly customer = {
    email: "sample@mail.com",
    name: "Sample Customer",
  };
  static readonly merchant = {
    email: "merchant@mail.com",
    name: "Sample Merchant",
    shopOrigin: "sample-merchant.myshopify.com",
  };
  static readonly shippingAddress = { ...mockAddress };
  static readonly billingAddress = { ...mockAddress };
  static readonly lineNumber1 = 1;
  static readonly quantity1 = 2;
  static readonly lineItem1Properties = [
    { name: "Top Text", value: "Sample" },
    { name: "Bottom Text", value: "Sample" },
  ];
  static catalogVariant: CatalogVariant = {
    id: mockUuid1,
    productId: mockUuid1,
    productTypeId: mockUuid1,
    height: { units: "mm", dimension: 0 },
    width: { units: "mm", dimension: 0 },
    sku: VSKU,
    svg: SVG,
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
  static readonly lineItem1 = {
    lineNumber: SalesOrderMocks.lineNumber1,
    quantity: SalesOrderMocks.quantity1,
    properties: SalesOrderMocks.lineItem1Properties,
    variant: cloneDeep(SalesOrderMocks.catalogVariant),
  };

  static placedDetails: OrderPlacedDetails = {
    accountId: SalesOrderMocks.accountId,
    orderName: SalesOrderMocks.orderName,
    orderDate: SalesOrderMocks.orderDate,
    orderNumber: SalesOrderMocks.orderNumber,
    customer: SalesOrderMocks.customer,
    merchant: SalesOrderMocks.merchant,
    lineItems: [SalesOrderMocks.lineItem1 as any],
    shippingAddress: SalesOrderMocks.shippingAddress,
    billingAddress: SalesOrderMocks.billingAddress,
  };
  static orderPlacedEvent: SalesOrderPlaced = new SalesOrderPlaced(
    null,
    cloneDeep(SalesOrderMocks.placedDetails)
  );

  static readonly id = "000000000000000000000001";
  static readonly id2 = "000000000000000000000002";

  static readonly salesLineItem1: ISalesLineItemProps = {
    lineNumber: SalesOrderMocks.lineNumber1,
    quantity: SalesOrderMocks.quantity1,
    variant: cloneDeep(SalesOrderMocks.catalogVariant) as any,
    personalization: cloneDeep(SalesOrderMocks.lineItem1Properties),
    flags: [],
  };

  /** ORDER CREATED */
  static orderProps: ISalesOrderProps = {
    id: SalesOrderMocks.id,
    accountId: SalesOrderMocks.accountId,
    orderName: SalesOrderMocks.orderName,
    orderNumber: SalesOrderMocks.orderNumber,
    orderDate: SalesOrderMocks.orderDate,
    orderStatus: OrderStatus.OPEN,
    lineItems: [SalesOrderMocks.salesLineItem1],
    customer: { ...SalesOrderMocks.customer },
    merchant: { ...SalesOrderMocks.merchant },
    shippingAddress: { ...SalesOrderMocks.shippingAddress },
    billingAddress: { ...SalesOrderMocks.billingAddress },
    events: [],
    updatedAt: now,
    createdAt: now,
  };
  static order: SalesOrder = new SalesOrder(SalesOrderMocks.orderProps);
}
