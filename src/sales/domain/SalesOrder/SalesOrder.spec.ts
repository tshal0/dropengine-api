import mongoose, { Types } from "mongoose";

import { CreateOrderApiDto, CreateOrderLineItemApiDto } from "@sales/api";
import {
  MongoSalesLineItem,
  MongoSalesOrder,
  MongoSalesVariant,
} from "@sales/database";
import moment from "moment";
import { invalidPersonalization } from "./fixtures/create.invalidPersonalization";
import { validDto } from "./fixtures/create.validDto";

import { mockAddress } from "../../mocks/mockAddress";
import { InvalidShippingAddressException, SalesOrder } from "./SalesOrder";
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
import { cloneDeep } from "lodash";
import safeJsonStringify from "safe-json-stringify";
export class NoErrorThrownError extends Error {}

export const getAsyncError = async <TError>(
  call: () => unknown
): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

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
  const orderId = "000000000000000000000001";
  const oid = new Types.ObjectId(orderId);
  const lineItemId = "000000000000000000000002";
  const lid = new Types.ObjectId(lineItemId);
  const mli: MongoSalesLineItem = new MongoSalesLineItem();
  mli._id = lid;
  mli.id = lineItemId;
  mli.lineNumber = 1;
  mli.quantity = mockLineItem.quantity;
  mli.variant = mockVariant;
  mli.personalization = [
    { name: mockTopText, value: "ValidText" },
    { name: mockMiddleText, value: "ValidText" },
    { name: mockBottomText, value: "ValidText" },
    { name: mockInitial, value: "M" },
  ];
  mli.flags = [];
  mli.updatedAt = now;
  mli.createdAt = now;
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
  describe("updateShippingAddress", () => {
    describe("given valid ShippingAddress", () => {
      it("should update the SalesOrder with the given Address", async () => {
        const order = await SalesOrder.load(cloneDeep(mock));
        const mockDto = {
          shippingAddress: cloneDeep(mockAddress),
        };
        const result = await order.updateShippingAddress(mockDto);
        const props = result.props().shippingAddress;
        const value = result.value().shippingAddress.value();
        expect(props).toEqual(mockAddress);
        expect(value).toEqual(mockAddress);
      });
    });
    describe("given invalid ShippingAddress (countryCode:null)", () => {
      it("should throw InvalidShippingAddressException", async () => {
        const order = await SalesOrder.load(cloneDeep(mock));
        const mockDto = {
          shippingAddress: cloneDeep(mockAddress),
        };
        mockDto.shippingAddress.countryCode = null;
        const error: InvalidShippingAddressException = await getAsyncError(
          async () => order.updateShippingAddress(mockDto)
        );
        console.log(safeJsonStringify(error as any, null, 2));

        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(InvalidShippingAddressException);
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to update shipping address for order '000000000000000000000001': InvalidSalesOrderAddress: SalesOrderAddress encountered validation errors. See inner for details.",
            timestamp: now,
            error: "InvalidShippingAddress",
            details: {
              orderId: "000000000000000000000001",
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
                countryCode: null,
                provinceCode: "OH",
              },
              reason:
                "InvalidSalesOrderAddress: SalesOrderAddress encountered validation errors. See inner for details.",
              inner: [
                {
                  value: {
                    value: null,
                    property: "countryCode",
                    children: [],
                    constraints: {
                      isNotEmpty: "countryCode should not be empty",
                      isString: "countryCode must be a string",
                    },
                  },
                  reason: "'countryCode' is invalid.",
                  name: "AddressValidationError",
                  message:
                    "AddressValidationError 'An instance of an object has failed the validation:\n - property countryCode has failed the following constraints: isNotEmpty, isString \n': 'countryCode' is invalid.",
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to update shipping address for order '000000000000000000000001': InvalidSalesOrderAddress: SalesOrderAddress encountered validation errors. See inner for details.",
          name: "InvalidShippingAddressException",
        };
        expect(error.getResponse()).toEqual(expected.response);
      });
    });
  });

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
        const createOrderDto: CreateOrderDto = new CreateOrderDto(dto);

        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();
        const expected = validDto(now);
        expected.lineItems = [];
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
        const createOrderDto: CreateOrderDto = new CreateOrderDto(dto);

        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();
        const expected = invalidPersonalization(now);
        expected.lineItems = [];
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
        const createOrderDto: CreateOrderDto = new CreateOrderDto(dto);

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
          ],
          value: {
            accountId: null,
            orderName: null,
            orderDate: null,
            orderNumber: null,
            customer: null,
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
        const order = await SalesOrder.load(cloneDeep(mock));
        const props = order.props();
        const entity = order.entity();
        const expected = {
          id: orderId,
          accountId: mockUuid1,
          orderNumber: 1000,
          orderDate: now,
          orderStatus: "OPEN",
          lineItems: [],
          customer: mockCustomer,
          shippingAddress: mockAddress,
          billingAddress: mockAddress,
        };
        expect(props).toEqual(expected);
        expect(entity).toEqual(mock);
      });
    });
    describe("with invalid properties", () => {
      it("should fail", async () => {
        const mockOrder = cloneDeep(mock);
        mockOrder.orderDate = null;
        const expected = {
          inner: [
            {
              reason: "SalesOrderDate must be a valid Date.",
              name: "InvalidSalesOrderDate",
              message:
                "InvalidSalesOrderDate 'null': SalesOrderDate must be a valid Date.",
              value: null,
            },
          ],
          value: {
            _id: oid,
            id: "000000000000000000000001",
            accountId: mockUuid1,
            orderStatus: "OPEN",
            orderDate: null,
            orderNumber: 1000,
            lineItems: [
              {
                _id: lid,
                id: "000000000000000000000002",
                lineNumber: 1,
                quantity: 1,
                variant: mockVariant,
                personalization: mockOrder.lineItems[0].personalization,
                flags: [],
                updatedAt: now,
                createdAt: now,
              },
            ],
            customer: mockCustomer,
            shippingAddress: mockAddress,
            billingAddress: mockAddress,
          },
          reason:
            "Failed to load SalesOrder from Mongo. See inner for details.",
          name: "InvalidSalesOrder",
          message:
            "InvalidSalesOrder '000000000000000000000001' 'undefined': Failed to load SalesOrder from Mongo. See inner for details.",
        };
        const error = await getAsyncError(async () =>
          SalesOrder.load(mockOrder)
        );
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toEqual(expected);
      });
    });
  });
});
