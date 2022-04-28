import { Types } from "mongoose";

import { CreateOrderApiDto, CreateOrderLineItemApiDto } from "@sales/api";
import {
  MongoLineItem,
  MongoSalesOrder,
  MongoSalesVariant,
} from "@sales/database";
import moment from "moment";
import { invalidPersonalization } from "./fixtures/create.invalidPersonalization";
import { validDto } from "./fixtures/create.validDto";

import { mockAddress } from "../../mocks/mockAddress";
import { SalesOrder } from "./SalesOrder";
import { CreateLineItemDto, CreateOrderDto } from "@sales/dto";
import {
  mockUuid1,
  mockCustomer,
  mockLineItem,
  mockCatalogVariant1,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
} from "@sales/mocks";
import { getAsyncError, NoErrorThrownError } from "@shared/utils";
const nowStr = "2021-01-01T00:00:00.000Z";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date(nowStr).valueOf());

describe("SalesOrder", () => {
  const now = moment().toDate();
  const mockOrderName = "SLI-1000";
  const mockOrderNumber = "1000";

  const dto: CreateOrderApiDto = {
    accountId: mockUuid1,
    orderName: mockOrderName,
    orderDate: now,
    orderNumber: mockOrderNumber,
    customer: mockCustomer,
    lineItems: [mockLineItem],
    shippingAddress: mockAddress,
    billingAddress: mockAddress,
  };
  describe("create", () => {
    describe("with a valid DTO", () => {
      it("should generate a valid SalesOrder", async () => {
        const mockLineItem1: CreateLineItemDto = {
          lineNumber: 1,
          quantity: 1,
          variant: mockCatalogVariant1,
          properties: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
        };
        const lineItems: CreateLineItemDto[] = [mockLineItem1];
        const createOrderDto: CreateOrderDto = new CreateOrderDto(
          dto,
          lineItems
        );

        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();

        const expected = validDto(now);
        expect(props).toEqual(expected);
      });
    });
    describe("with invalid Personalization", () => {
      it("should create an Order, flagged with PersonalizationErrors", async () => {
        const mockOrderName = "SLI-1000";
        const mockOrderNumber = "1000";

        const dto: CreateOrderApiDto = {
          accountId: mockUuid1,
          orderName: mockOrderName,
          orderDate: now,
          orderNumber: mockOrderNumber,
          customer: mockCustomer,
          lineItems: [mockLineItem],
          shippingAddress: mockAddress,
          billingAddress: mockAddress,
        };
        const mockLineItem1: CreateLineItemDto = {
          lineNumber: 1,
          quantity: 1,
          variant: mockCatalogVariant1,
          properties: [
            { name: mockTopText, value: "TooLongExample1234" },
            { name: mockBottomText, value: "Bad-Character" },
            { name: mockInitial, value: "M" },
          ],
        };
        const lineItems: CreateLineItemDto[] = [mockLineItem1];
        const createOrderDto: CreateOrderDto = new CreateOrderDto(
          dto,
          lineItems
        );

        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();
        const expected = invalidPersonalization(now);

        expect(props).toEqual(expected);
      });
    });
    describe("with invalid properties", () => {
      it("should fail", async () => {
        const mockOrderName = "SLI-1000";
        const mockOrderNumber = "1000";

        const dto: CreateOrderApiDto = {
          accountId: null,
          orderName: null,
          orderDate: null,
          orderNumber: null,
          customer: null,
          lineItems: [null],
          shippingAddress: null,
          billingAddress: null,
        };
        const mockLineItem1: CreateLineItemDto = {
          lineNumber: 1,
          quantity: 1,
          variant: mockCatalogVariant1,
          properties: [
            { name: mockTopText, value: "TooLongExample1234" },
            { name: mockBottomText, value: "Bad-Character" },
            { name: mockInitial, value: "M" },
          ],
        };
        const lineItems: CreateLineItemDto[] = [null];
        const createOrderDto: CreateOrderDto = new CreateOrderDto(
          dto,
          lineItems
        );

        const expected = {
          inner: [
            {
              reason: "SalesOrderNumber must be a valid integer.",
              name: "InvalidSalesOrderNumber",
              message:
                "InvalidSalesOrderNumber 'null': SalesOrderNumber must be a valid integer.",
              value: null,
            },
            {
              reason: "SalesOrderDate must be a valid Date.",
              name: "InvalidSalesOrderDate",
              message:
                "InvalidSalesOrderDate 'null': SalesOrderDate must be a valid Date.",
              value: null,
            },
            {
              inner: [],
              value: null,
              reason:
                "SalesOrderCustomer must be a valid Customer, with a name and email.",
              name: "InvalidSalesOrderCustomer",
              message:
                "InvalidSalesOrderCustomer 'undefined': SalesOrderCustomer must be a valid Customer, with a name and email.",
            },
            {
              inner: [],
              value: null,
              reason: "SalesOrderAddress must be a valid Address.",
              name: "InvalidSalesOrderAddress",
              message:
                "InvalidSalesOrderAddress: SalesOrderAddress must be a valid Address.",
            },
            {
              inner: [],
              value: null,
              reason: "SalesOrderAddress must be a valid Address.",
              name: "InvalidSalesOrderAddress",
              message:
                "InvalidSalesOrderAddress: SalesOrderAddress must be a valid Address.",
            },
            {
              inner: [
                {
                  inner: [],
                  value: null,
                  reason: "Failed to create LineItem. LineItem is undefined.",
                  name: "InvalidLineItem",
                  message:
                    "InvalidLineItem 'undefined' 'undefined': Failed to create LineItem. LineItem is undefined.",
                },
              ],
              reason: "Failed to create LineItems. See inner for details.",
              name: "FailedToCreateLineItems",
              message:
                "FailedToCreateLineItems: Failed to create LineItems. See inner for details.",
            },
          ],
          value: {
            accountId: null,
            orderName: null,
            orderDate: null,
            orderNumber: null,
            customer: null,
            lineItems: [null],
            shippingAddress: null,
            billingAddress: null,
          },
          reason: "Failed to create SalesOrder. See inner for details.",
          name: "InvalidSalesOrder",
          message:
            "InvalidSalesOrder 'undefined' 'undefined': Failed to create SalesOrder. See inner for details.",
        };
        const error = await getAsyncError(async () =>
          SalesOrder.create(createOrderDto)
        );
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toMatchObject(expected);
      });
    });
  });
  describe("load", () => {
    describe("with a valid MongoSalesOrder", () => {
      it("should return SalesOrder", async () => {
        const mockVariant: MongoSalesVariant = {
          id: mockCatalogVariant1.id,
          sku: mockCatalogVariant1.sku,
          image: mockCatalogVariant1.image,
          svg: mockCatalogVariant1.svg,
          type: mockCatalogVariant1.type,
          option1: mockCatalogVariant1.option1,
          option2: mockCatalogVariant1.option2,
          option3: mockCatalogVariant1.option3,
          manufacturingCost: mockCatalogVariant1.manufacturingCost,
          shippingCost: mockCatalogVariant1.shippingCost,
          weight: mockCatalogVariant1.weight,
          productionData: mockCatalogVariant1.productionData,
          personalizationRules: mockCatalogVariant1.personalizationRules,
        };
        const orderId = "00000000515bd494ed80cfbd";
        const oid = new Types.ObjectId(orderId);
        const lineItemId = "00000000515bd494ed80cfbd";
        const lid = new Types.ObjectId(lineItemId);
        const mli: MongoLineItem = {
          _id: lid,
          id: lineItemId,
          lineNumber: 1,
          quantity: mockLineItem.quantity,
          variant: mockVariant,
          personalization: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
          flags: [],
          updatedAt: now,
          createdAt: now,
        };
        const mock: MongoSalesOrder = {
          _id: oid,
          id: orderId,
          accountId: mockUuid1,
          orderStatus: "OPEN",
          orderDate: dto.orderDate,
          orderNumber: +dto.orderNumber,
          lineItems: [mli],
          customer: dto.customer,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.billingAddress,
          updatedAt: undefined,
          createdAt: undefined,
        };
        const order = await SalesOrder.load(mock);
        const props = order.props();
        const entity = order.entity();
        const value = order.value();
        const expected = {
          id: orderId,
          accountId: mockUuid1,
          orderNumber: 1000,
          orderDate: now,
          orderStatus: "OPEN",
          lineItems: [
            {
              id: lineItemId,
              lineNumber: 1,
              quantity: 1,
              variant: {
                id: "00000000-0000-0000-0000-000000000001",
                sku: "MU-C004-00-18-Black",
                image: "mock_image",
                svg: "mock_svg",
                type: "2DMetalArt",
                option1: {
                  name: "Size",
                  option: '18"',
                  enabled: true,
                },
                option2: {
                  name: "Color",
                  option: "Black",
                  enabled: true,
                },
                option3: {
                  option: null,
                  enabled: false,
                },
                manufacturingCost: {
                  currency: "USD",
                  total: 650,
                },
                shippingCost: {
                  currency: "USD",
                  total: 1200,
                },
                weight: {
                  units: "oz",
                  dimension: 738,
                },
                productionData: {
                  material: "Mild Steel",
                  route: "1",
                  thickness: "0.06",
                },
                personalizationRules: [
                  {
                    name: "top_text",
                    label: "Top Text",
                    placeholder: "Enter up to 16 characters",
                    required: true,
                    type: "input",
                    maxLength: 16,
                    pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                    options: "",
                  },
                  {
                    name: "middle_text",
                    label: "Middle Text",
                    placeholder: "Enter up to 14 characters",
                    required: true,
                    type: "input",
                    maxLength: 14,
                    pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                    options: "",
                  },
                  {
                    name: "bottom_text",
                    label: "Bottom Text",
                    placeholder: "Enter up to 16 characters",
                    required: true,
                    type: "input",
                    maxLength: 16,
                    pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                    options: "",
                  },
                  {
                    name: "initial",
                    label: "Initial",
                    placeholder: "Select Initial",
                    required: true,
                    type: "dropdownlist",
                    maxLength: null,
                    options:
                      "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
                  },
                ],
              },
              personalization: [
                {
                  name: "Top Text",
                  value: "ValidText",
                },
                {
                  name: "Middle Text",
                  value: "ValidText",
                },
                {
                  name: "Bottom Text",
                  value: "ValidText",
                },
                {
                  name: "Initial",
                  value: "M",
                },
              ],
              flags: [],
              createdAt: now,
              updatedAt: now,
            },
          ],
          customer: {
            email: "mock.customer@email.com",
            name: "Mock Customer",
          },
          shippingAddress: {
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
            longitude: -82.1265222,
            province: "Ohio",
            lastName: "Stark",
            firstName: "Tony",
            countryCode: "US",
            provinceCode: "OH",
          },
          billingAddress: {
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
            longitude: -82.1265222,
            province: "Ohio",
            lastName: "Stark",
            firstName: "Tony",
            countryCode: "US",
            provinceCode: "OH",
          },
        };
        expect(props).toEqual(expected);
        expect(entity).toEqual(mock);
      });
    });
    describe("with invalid properties", () => {
      it("should fail", async () => {
        const mockVariant: MongoSalesVariant = {
          id: mockCatalogVariant1.id,
          sku: mockCatalogVariant1.sku,
          image: mockCatalogVariant1.image,
          svg: mockCatalogVariant1.svg,
          type: mockCatalogVariant1.type,
          option1: mockCatalogVariant1.option1,
          option2: mockCatalogVariant1.option2,
          option3: mockCatalogVariant1.option3,
          manufacturingCost: mockCatalogVariant1.manufacturingCost,
          shippingCost: mockCatalogVariant1.shippingCost,
          weight: mockCatalogVariant1.weight,
          productionData: mockCatalogVariant1.productionData,
          personalizationRules: mockCatalogVariant1.personalizationRules,
        };
        const orderId = "00000000515bd494ed80cfbd";
        const oid = new Types.ObjectId(orderId);
        const lineItemId = "00000000515bd494ed80cfbd";
        const lid = new Types.ObjectId(lineItemId);
        const mli: MongoLineItem = {
          _id: lid,
          id: lineItemId,
          lineNumber: 1,
          quantity: mockLineItem.quantity,
          variant: mockVariant,
          personalization: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
          ],
          flags: [],
          updatedAt: now,
          createdAt: now,
        };
        const mock: MongoSalesOrder = {
          _id: oid,
          id: orderId,
          accountId: mockUuid1,
          orderStatus: "OPEN",
          orderDate: null,
          orderNumber: +dto.orderNumber,
          lineItems: [mli, null],
          customer: dto.customer,
          shippingAddress: dto.shippingAddress,
          billingAddress: dto.billingAddress,
          updatedAt: now,
          createdAt: now,
        };
        const expected = {
          inner: [
            {
              reason: "SalesOrderDate must be a valid Date.",
              name: "InvalidSalesOrderDate",
              message:
                "InvalidSalesOrderDate 'null': SalesOrderDate must be a valid Date.",
              value: null,
            },
            {
              inner: [
                {
                  inner: [],
                  value: null,
                  reason: "Failed to create LineItem. LineItem is undefined.",
                  name: "InvalidLineItem",
                  message:
                    "InvalidLineItem 'undefined' 'undefined': Failed to create LineItem. LineItem is undefined.",
                },
              ],
              reason:
                "Failed to load LineItems from Mongo. See inner error for details.",
              name: "FailedToLoadLineItems",
              message:
                "FailedToLoadLineItems: Failed to load LineItems from Mongo. See inner error for details.",
            },
          ],
          value: {
            _id: oid,
            id: "00000000515bd494ed80cfbd",
            accountId: mockUuid1,
            orderStatus: "OPEN",
            orderDate: null,
            orderNumber: 1000,
            lineItems: [
              {
                _id: lid,
                id: "00000000515bd494ed80cfbd",
                lineNumber: 1,
                quantity: 1,
                variant: {
                  id: "00000000-0000-0000-0000-000000000001",
                  sku: "MU-C004-00-18-Black",
                  image: "mock_image",
                  svg: "mock_svg",
                  type: "2DMetalArt",
                  option1: {
                    name: "Size",
                    option: '18"',
                    enabled: true,
                  },
                  option2: {
                    name: "Color",
                    option: "Black",
                    enabled: true,
                  },
                  option3: {
                    option: null,
                    enabled: false,
                  },
                  manufacturingCost: {
                    total: 650,
                    currency: "USD",
                  },
                  shippingCost: {
                    total: 1200,
                    currency: "USD",
                  },
                  weight: {
                    units: "oz",
                    dimension: 738,
                  },
                  productionData: {
                    material: "Mild Steel",
                    route: "1",
                    thickness: "0.06",
                  },
                  personalizationRules: [
                    {
                      name: "top_text",
                      type: "input",
                      label: "Top Text",
                      options: "",
                      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                      required: true,
                      maxLength: 16,
                      placeholder: "Enter up to 16 characters",
                    },
                    {
                      name: "middle_text",
                      type: "input",
                      label: "Middle Text",
                      options: "",
                      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                      required: true,
                      maxLength: 14,
                      placeholder: "Enter up to 14 characters",
                    },
                    {
                      name: "bottom_text",
                      type: "input",
                      label: "Bottom Text",
                      options: "",
                      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                      required: true,
                      maxLength: 16,
                      placeholder: "Enter up to 16 characters",
                    },
                    {
                      name: "initial",
                      type: "dropdownlist",
                      label: "Initial",
                      options:
                        "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
                      required: true,
                      maxLength: null,
                      placeholder: "Select Initial",
                    },
                  ],
                },
                personalization: [
                  {
                    name: "Top Text",
                    value: "ValidText",
                  },
                  {
                    name: "Middle Text",
                    value: "ValidText",
                  },
                  {
                    name: "Bottom Text",
                    value: "ValidText",
                  },
                ],
                flags: [
                  {
                    type: "MissingPersonalization",
                    details: {
                      lineNumber: 1,
                      property: "Initial",
                      reason: "MISSING",
                    },
                    message: "Line Item #1 is missing property 'Initial'.",
                  },
                ],
                updatedAt: now,
                createdAt: now,
              },
              null,
            ],
            customer: {
              email: "mock.customer@email.com",
              name: "Mock Customer",
            },
            shippingAddress: {
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
            },
            billingAddress: {
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
            },
            updatedAt: now,
            createdAt: now,
          },
          reason:
            "Failed to load SalesOrder from Mongo. See inner for details.",
          name: "InvalidSalesOrder",
          message:
            "InvalidSalesOrder '00000000515bd494ed80cfbd' 'undefined': Failed to load SalesOrder from Mongo. See inner for details.",
        };
        const error = await getAsyncError(async () => SalesOrder.load(mock));
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toMatchObject(expected);
      });
    });
  });
});
