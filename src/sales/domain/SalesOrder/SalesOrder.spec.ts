import { invalidPersonalization } from "./fixtures/create.invalidPersonalization";
import { validDto } from "./fixtures/create.validDto";

import { mockAddress } from "../../mocks/mockAddress";
import { SalesOrder } from "./SalesOrder";
import { InvalidShippingAddressException } from "./InvalidShippingAddressException";
import { CreateOrderDto } from "@sales/dto";
import { mockUuid1, mockCustomer } from "@sales/mocks";
import { cloneDeep } from "lodash";
import {
  mockCreateOrderApiDto,
  mockCreateOrderDto,
  mockCreateOrderDtoLineItems,
  mockOrderId,
  now,
} from "@sales/dto/CreateOrderDto.mock";
import {
  mockMongoSalesLineItem,
  mockMongoSalesOrder,
} from "./SalesOrder.mocks";
import { SalesOrderID } from "../ValueObjects";
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
describe("SalesOrder", () => {
  describe("updateShippingAddress", () => {
    describe("given valid ShippingAddress", () => {
      it("should update the SalesOrder with the given Address", async () => {
        const order = await SalesOrder.load(cloneDeep(mockMongoSalesOrder));
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
        const order = await SalesOrder.load(cloneDeep(mockMongoSalesOrder));
        const mockUpdateShippingAddress = cloneDeep(mockAddress);
        mockUpdateShippingAddress.countryCode = null;
        const mockDto = {
          shippingAddress: cloneDeep(mockUpdateShippingAddress),
        };
        const error: InvalidShippingAddressException = await getAsyncError(
          async () => order.updateShippingAddress(mockDto)
        );

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
              shippingAddress: mockUpdateShippingAddress,
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
        const createOrderDto: CreateOrderDto = Object.assign(
          new CreateOrderDto(),
          mockCreateOrderDto
        );
        createOrderDto.lineItems = mockCreateOrderDtoLineItems;
        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();
        const expected = validDto(now);
        expect(props).toEqual(expected);
      });
    });
    describe("with invalid Personalization", () => {
      it("should create an Order, flagged with PersonalizationErrors", async () => {
        const mli = cloneDeep(mockCreateOrderDtoLineItems[0]);
        mli.properties = [
          {
            name: "Top Text",
            value: "TooLongExample1234",
          },
          {
            name: "Bottom Text",
            value: "Bad-Character",
          },
          {
            name: "Initial",
            value: "M",
          },
        ];
        const createOrderDto: CreateOrderDto = Object.assign(
          new CreateOrderDto(),
          mockCreateOrderDto
        );
        createOrderDto.lineItems = [mli];
        let order = await SalesOrder.create(createOrderDto);

        const props = order.props();
        const expected = invalidPersonalization(now);
        expect(props).toEqual(expected);
      });
    });
    describe("with invalid properties", () => {
      it("should fail", async () => {
        const mockDto = cloneDeep(mockCreateOrderApiDto);
        mockDto.orderNumber = null;
        mockDto.orderName = null;

        mockDto.orderDate = null;
        mockDto.accountId = null;
        mockDto.customer = null;
        mockDto.shippingAddress = null;
        mockDto.billingAddress = null;
        const createOrderDto: CreateOrderDto = Object.assign(
          new CreateOrderDto(),
          mockDto
        );
        createOrderDto.lineItems = mockCreateOrderDtoLineItems;
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
        const order = await SalesOrder.load(cloneDeep(mockMongoSalesOrder));
        const props = order.props();
        const entity = order.entity();
        const expected = {
          id: mockOrderId,
          accountId: mockUuid1,
          orderNumber: 1000,
          orderDate: now,
          orderStatus: "OPEN",
          lineItems: [{ ...mockMongoSalesLineItem, _id: undefined }],
          customer: mockCustomer,
          shippingAddress: mockAddress,
          billingAddress: mockAddress,
        };
        expect(props).toEqual(expected);
        expect(entity).toEqual(mockMongoSalesOrder);
      });
    });
    describe("with invalid properties", () => {
      it("should fail", async () => {
        const mockOrder = cloneDeep(mockMongoSalesOrder);
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
            _id: mockMongoSalesOrder._id,
            id: "000000000000000000000001",
            accountId: mockUuid1,
            orderStatus: "OPEN",
            orderDate: null,
            orderNumber: 1000,
            lineItems: [
              {
                _id: mockMongoSalesLineItem._id,
                id: "000000000000000000000002",
                lineNumber: 1,
                quantity: 1,
                variant: mockMongoSalesLineItem.variant,
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
