import { TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { Result } from "@shared/domain";
import { now, spyOnDate } from "@shared/mocks";
import {
  CatalogService,
  CatalogServiceError,
  CatalogVariant,
  FailedToLoadVariantByIdException,
  FailedToLoadVariantBySkuException,
} from "@catalog/services";

import {
  CreateSalesOrder,
  CreateSalesOrderError,
  FailedToPlaceSalesOrderException,
} from "..";
import { mockSalesModule } from "./createSalesOrder.mock";
import { createSalesOrderDto, expectedCreateOrderProps } from "./fixtures";

import { CreateOrderApiDto, CreateOrderLineItemApiDto } from "@sales/api";
import { CreateOrderDto } from "@sales/dto";
import {
  MongoOrdersRepository,
  MongoSalesOrder,
  MongoSalesOrderDocument,
  SalesOrderRepository,
} from "@sales/database";
import { SalesOrder } from "@sales/domain";
import {
  mockCatalogVariant1,
  mockCustomer,
  mockOrderName1,
  mockOrderNumber1,
  mockUuid1,
  mockAddress,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
  mockLineItem,
} from "@sales/mocks";

import { cloneDeep } from "lodash";
import { CreateSalesOrderDto } from "./CreateSalesOrderDto";
import { AuthenticatedUser } from "@shared/decorators";
import safeJsonStringify from "safe-json-stringify";
import { CreateSalesOrderLineItemDto } from "./CreateSalesOrderLineItemDto";
import { ICustomOptionProps } from "@catalog/domain";
class NoErrorThrownError extends Error {}

const getAsyncError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

describe("CreateSalesOrder", () => {
  let module: TestingModule;
  let service: CreateSalesOrder;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);
  let catalogService: CatalogService;
  let ordersRepo: MongoOrdersRepository;
  let salesRepo: SalesOrderRepository;
  beforeAll(() => {});

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    service = await module.resolve<CreateSalesOrder>(CreateSalesOrder);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
    catalogService = await module.resolve<CatalogService>(CatalogService);

    // Set up Repo
    ordersRepo = await module.resolve<MongoOrdersRepository>(
      MongoOrdersRepository
    );
    salesRepo = await module.resolve<SalesOrderRepository>(
      SalesOrderRepository
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  // GIVEN
  // WHEN
  // THEN
  describe("loadVariantById", () => {
    it("should work", async () => {
      // GIVEN
      const params = "MOCK_ID";
      const expected = {};
      jest
        .spyOn(catalogService, "loadVariantById")
        .mockResolvedValue({} as any);
      // WHEN
      const result = await service.loadVariantById(params);
      // THEN
      expect(result).toEqual(expected);
    });
    it("should throw on CatalogService exception", async () => {
      // GIVEN
      const params = "";

      const catalogServiceException = new FailedToLoadVariantByIdException(
        params,
        `MOCK_CATALOG_EXCEPTION`
      );

      const expected = {
        response: {
          statusCode: 500,
          message:
            "Failed to load ProductVariant with ID '': MOCK_CATALOG_EXCEPTION",
          timestamp: now,
          error: CatalogServiceError.FailedToLoadVariant,
          details: {
            id: params,
            inner: ["MOCK_CATALOG_EXCEPTION"],
          },
        },
        status: 500,
        message:
          "Failed to load ProductVariant with ID '': MOCK_CATALOG_EXCEPTION",
        name: "FailedToLoadVariantByIdException",
      };
      const mockThrow = () => {
        throw catalogServiceException;
      };
      jest
        .spyOn(catalogService, "loadVariantById")
        .mockImplementation(mockThrow);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.loadVariantById(params)
      );

      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error.getResponse()).toEqual(expected.response);
    });
  });
  describe("loadVariantBySku", () => {
    it("should work", async () => {
      // GIVEN
      const params = "MOCK_SKU";
      const expected = {};
      jest
        .spyOn(catalogService, "loadVariantById")
        .mockResolvedValue({} as any);
      // WHEN
      const result = await service.loadVariantById(params);
      // THEN
      expect(result).toEqual(expected);
    });
    it("should throw on CatalogService exception", async () => {
      // GIVEN
      const params = "";

      const catalogServiceException = new FailedToLoadVariantBySkuException(
        params,
        `MOCK_CATALOG_EXCEPTION`
      );

      const expected = {
        response: {
          statusCode: 500,
          message:
            "Failed to load ProductVariant with SKU '': MOCK_CATALOG_EXCEPTION",
          timestamp: now,
          error: CatalogServiceError.FailedToLoadVariant,
          details: {
            id: params,
            inner: ["MOCK_CATALOG_EXCEPTION"],
          },
        },
        status: 500,
        message:
          "Failed to load ProductVariant with SKU '': MOCK_CATALOG_EXCEPTION",
        name: "FailedToLoadVariantBySkuException",
      };
      const mockThrow = () => {
        throw catalogServiceException;
      };
      jest
        .spyOn(catalogService, "loadVariantBySku")
        .mockImplementation(mockThrow);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.loadVariantBySku(params)
      );

      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error.getResponse()).toEqual(expected.response);
      expect(error.name).toEqual(expected.name);
    });
  });
  describe("loadCatalogVariant", () => {
    const mockVariant: CatalogVariant = mockCatalogVariant();
    describe("given SKU", () => {
      it("should call loadVariantBySku", async () => {
        const sku = "MOCK_SKU";
        const vid = "";
        // GIVEN

        const params: CreateOrderLineItemApiDto = {
          quantity: 1,
          lineItemProperties: [],
          sku: sku,
          variantId: vid,
        };
        const expected = {
          id: "MOCK_ID",
          sku: "MOCK_SKU",
          image: "MOCK_IMAGE",
          svg: "MOCK_SVG",
          type: "MOCK_TYPE",
          option1: {
            enabled: true,
            name: "Size",
            option: "12",
          },
          option2: {
            enabled: true,
            name: "Color",
            option: "Black",
          },
          option3: null,
          productionData: null,
          personalizationRules: [
            {
              maxLength: 12,
              pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
              type: "input",
              required: true,
              label: "Top Text",
              placeholder: "Enter up to 12 characters",
              name: "top_text",
            },
            {
              maxLength: 12,
              pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
              type: "input",
              required: true,
              label: "Bottom Text",
              placeholder: "Enter up to 12 characters",
              name: "bottom_text",
            },
          ],
          manufacturingCost: {
            total: 11,
            currency: "USD",
          },
          shippingCost: {
            total: 11,
            currency: "USD",
          },
          weight: {
            dimension: 120,
            units: "oz",
          },
        };

        let catalogSpy = jest
          .spyOn(catalogService, "loadVariantBySku")
          .mockResolvedValue(mockVariant);
        // WHEN
        const result = await service.loadCatalogVariant(params);
        console.log(safeJsonStringify(result, null, 2));
        // THEN
        expect(result).toEqual(expected);
        expect(catalogSpy).toBeCalledTimes(1);
      });
    });
    describe("given ID", () => {
      it("should call loadVariantById", async () => {
        const sku = null;
        const vid = "MOCK_ID";
        // GIVEN

        const params: CreateOrderLineItemApiDto = {
          quantity: 1,
          lineItemProperties: [],
          sku: sku,
          variantId: vid,
        };
        const expected = {
          id: "MOCK_ID",
          sku: "MOCK_SKU",
          image: "MOCK_IMAGE",
          svg: "MOCK_SVG",
          type: "MOCK_TYPE",
          option1: {
            enabled: true,
            name: "Size",
            option: "12",
          },
          option2: {
            enabled: true,
            name: "Color",
            option: "Black",
          },
          option3: null,
          productionData: null,
          personalizationRules: [
            {
              maxLength: 12,
              pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
              type: "input",
              required: true,
              label: "Top Text",
              placeholder: "Enter up to 12 characters",
              name: "top_text",
            },
            {
              maxLength: 12,
              pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
              type: "input",
              required: true,
              label: "Bottom Text",
              placeholder: "Enter up to 12 characters",
              name: "bottom_text",
            },
          ],
          manufacturingCost: {
            total: 11,
            currency: "USD",
          },
          shippingCost: {
            total: 11,
            currency: "USD",
          },
          weight: {
            dimension: 120,
            units: "oz",
          },
        };

        let catalogSpy = jest
          .spyOn(catalogService, "loadVariantById")
          .mockResolvedValue(mockVariant);
        // WHEN
        const result = await service.loadCatalogVariant(params);
        // THEN
        expect(result).toEqual(expected);
        expect(catalogSpy).toBeCalledTimes(1);
      });
    });
    it("should work", async () => {});
  });
  describe("validateDomainDto", () => {
    it("should work", async () => {
      const mockDto = newMockCreateSalesOrderDto();
      // GIVEN
      const params: CreateOrderDto = {
        accountId: mockDto.accountId,
        orderName: mockDto.orderName,
        orderDate: mockDto.orderDate,
        orderNumber: mockDto.orderNumber,
        customer: mockDto.customer,
        lineItems: [],
        shippingAddress: mockDto.shippingAddress,
        billingAddress: mockDto.billingAddress,
      };
      const expected = {};
      // WHEN
      // THEN
      await expect(
        service.validateDomainDto(params)
      ).resolves.not.toThrowError();
    });
    describe("given invalid DTO", () => {
      it("should throw FailedToPlaceSalesOrderException: InvalidSalesOrder", async () => {
        const mockDto = newMockCreateSalesOrderDto();
        // GIVEN
        const params: CreateOrderDto = new CreateOrderDto();
        params.accountId = mockDto.accountId;
        params.orderName = undefined;
        params.orderDate = undefined;
        params.orderNumber = mockDto.orderNumber;
        params.customer = mockDto.customer;
        params.lineItems = [];
        params.shippingAddress = mockDto.shippingAddress;
        params.billingAddress = mockDto.billingAddress;

        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'undefined': Validation errors found.",
            timestamp: now,
            error: "InvalidSalesOrder",
            details: {
              orderNumber: "1001",
              reason: "Validation errors found.",
              inner: [
                {
                  property: "orderName",
                  children: [],
                  constraints: {
                    isNotEmpty: "orderName should not be empty",
                    isString: "orderName must be a string",
                  },
                },
                {
                  property: "orderDate",
                  children: [],
                  constraints: {
                    isNotEmpty: "orderDate should not be empty",
                    isDate: "orderDate must be a Date instance",
                  },
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'undefined': Validation errors found.",
          name: FailedToPlaceSalesOrderException.name,
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.validateDomainDto(params)
        );

        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });
  describe("validateUseCaseDto", () => {
    it("should work", async () => {
      // GIVEN
      const params: CreateSalesOrderDto = newMockCreateSalesOrderDto();

      const expected = {};
      // WHEN
      // THEN
      await expect(
        service.validateUseCaseDto(params)
      ).resolves.not.toThrowError();
    });
    describe("given invalid DTO", () => {
      it("should throw FailedToPlaceSalesOrderException: InvalidSalesOrder", async () => {
        const params = new CreateSalesOrderDto();
        // GIVEN

        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'undefined': Validation errors found.",
            timestamp: now,
            error: CreateSalesOrderError.InvalidSalesOrder,
            details: {
              reason: "Validation errors found.",
              inner: [
                {
                  property: "accountId",
                  children: [],
                  constraints: {
                    isNotEmpty: "accountId should not be empty",
                    isString: "accountId must be a string",
                  },
                },
                {
                  property: "orderDate",
                  children: [],
                  constraints: {
                    isDate: "orderDate must be a Date instance",
                    isNotEmpty: "orderDate should not be empty",
                  },
                },
                {
                  property: "orderNumber",
                  children: [],
                  constraints: {
                    isNotEmpty: "orderNumber should not be empty",
                  },
                },
                {
                  property: "customer",
                  children: [],
                  constraints: {
                    isNotEmptyObject: "customer must be a non-empty object",
                  },
                },
                {
                  property: "lineItems",
                  children: [],
                  constraints: {
                    isArray: "lineItems must be an array",
                  },
                },
                {
                  property: "shippingAddress",
                  children: [],
                  constraints: {
                    isNotEmptyObject:
                      "shippingAddress must be a non-empty object",
                  },
                },
                {
                  property: "user",
                  children: [],
                  constraints: {
                    isNotEmpty: "user should not be empty",
                    isNotEmptyObject: "user must be a non-empty object",
                  },
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'undefined': Validation errors found.",
          name: FailedToPlaceSalesOrderException.name,
        };

        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.validateUseCaseDto(params)
        );
        console.log(safeJsonStringify(error, null, 2));
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });
  describe("validateUserAuthorization", () => {
    it("should work", async () => {
      // GIVEN
      const params = newMockCreateSalesOrderDto();

      params.user = newMockUser();
      params.accountId = params.user.account.id;
      const expected = {};
      // WHEN
      // THEN
      expect(() =>
        service.validateUserAuthorization(params)
      ).not.toThrowError();
    });
    describe("given User with no Account matching given AccountId", () => {
      it("should throw FailedToPlaceSalesOrderException: UserNotAuthorizedForAccount", async () => {
        // GIVEN
        const params = newMockCreateSalesOrderDto();
        params.accountId = "MOCK_ACCOUNT_ID";
        params.user = new AuthenticatedUser({
          email: "mockUser@email.com",
          id: "MOCK_USER_ID",
          metadata: {
            accounts: [],
            authorization: {},
          },
        });
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'SLI-10000000001': User 'mockUser@email.com' not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
            timestamp: now,
            error: CreateSalesOrderError.UserNotAuthorizedForAccount,
            details: {
              orderName: "SLI-10000000001",
              orderNumber: "1001",
              reason:
                "User 'mockUser@email.com' not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
              inner: null,
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'SLI-10000000001': User not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
          name: FailedToPlaceSalesOrderException.name,
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.validateUserAuthorization(params)
        );
        console.log(safeJsonStringify(error, null, 2));
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
    describe("given User with Account matching given AccountId and no manage:orders permission", () => {
      it("should throw FailedToPlaceSalesOrderException: UserNotAuthorizedForAccount", async () => {
        // GIVEN
        const params = newMockCreateSalesOrderDto();
        params.accountId = "MOCK_ACCOUNT_ID";
        params.user = new AuthenticatedUser({
          email: "mockUser@email.com",
          id: "MOCK_USER_ID",
          metadata: {
            accounts: [
              {
                companyCode: "MOCK_COMPANY_CODE",
                id: params.accountId,
                name: "Mock Company",
                permissions: ["read:orders"],
                roles: [],
              },
            ],
            authorization: {},
          },
        });
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'SLI-10000000001': User 'mockUser@email.com' not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
            timestamp: now,
            error: CreateSalesOrderError.UserNotAuthorizedForAccount,
            details: {
              orderName: "SLI-10000000001",
              orderNumber: "1001",
              reason:
                "User 'mockUser@email.com' not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
              inner: null,
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'SLI-10000000001': User 'mockUser@email.com' not authorized to place orders for given Account: 'MOCK_ACCOUNT_ID'",
          name: FailedToPlaceSalesOrderException.name,
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.validateUserAuthorization(params)
        );
        console.log(safeJsonStringify(error, null, 2));
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });
  describe("generateLineItemDto", () => {
    it("should work", async () => {
      // GIVEN
      const variant = mockCatalogVariant();
      let skuSpy = jest
        .spyOn(catalogService, "loadVariantBySku")
        .mockResolvedValue(variant);
      let idSpy = jest
        .spyOn(catalogService, "loadVariantById")
        .mockResolvedValue(variant);
      const params: CreateSalesOrderLineItemDto = {
        quantity: 1,
        lineItemProperties: [
          { name: mockTopText, value: "ValidTopText" },
          { name: mockBottomText, value: "ValidBottomText" },
        ],
        sku: null,
        variantId: "MOCK_ID",
      };
      const index = 0;
      const expected = {
        lineNumber: 1,
        quantity: 1,
        variant: variant,
        properties: [
          { name: "Top Text", value: "ValidTopText" },
          { name: "Bottom Text", value: "ValidBottomText" },
        ],
      };
      // WHEN
      // THEN
      await expect(
        service.generateLineItemDto(params, index, null)
      ).resolves.toEqual(expected);
      expect(idSpy).toBeCalledTimes(1);
      expect(skuSpy).toBeCalledTimes(0);
    });
    describe("given null LineItemDto", () => {
      it("should throw FailedToPlaceSalesOrderException: MissingLineItem", async () => {
        // GIVEN

        const params: CreateSalesOrderLineItemDto = null;
        const index = 0;
        const dto = new CreateSalesOrderDto();
        dto.orderName = `MOCK_ORDER_NAME`;
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'MOCK_ORDER_NAME': LineItem '1' was null or undefined.",
            timestamp: now,
            error: CreateSalesOrderError.MissingLineItem,
            details: {
              orderName: "MOCK_ORDER_NAME",
              reason: "LineItem '1' was null or undefined.",
              inner: null,
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'MOCK_ORDER_NAME': LineItem '1' was null or undefined.",
          name: FailedToPlaceSalesOrderException.name,
        };
        const error: any = await getAsyncError(
          async () => await service.generateLineItemDto(params, index, dto)
        );
        console.log(safeJsonStringify(error, null, 2));
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
    describe("given invalid SKU", () => {
      it("should throw FailedToPlaceSalesOrderException: FailedToLoadVariant", () => {});
    });
  });
  describe("execute", () => {
    it("should work", async () => {
      // GIVEN
      const mockVariant: CatalogVariant = mockCatalogVariant();
      let skuSpy = jest
        .spyOn(catalogService, "loadVariantBySku")
        .mockResolvedValue(mockVariant);
      let params = newMockCreateSalesOrderDto();
      params.user = newMockUser();
      params.accountId = params.user.account.id;
      const expected = {
        accountId: "MOCK_ACCOUNT_ID",
        orderName: "SLI-10000000001",
        orderNumber: 1001,
        orderDate: now,
        orderStatus: "OPEN",
        lineItems: [
          {
            lineNumber: 1,
            quantity: 1,
            variant: mockVariant,
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
        customer: params.customer,
        shippingAddress: params.shippingAddress,
        billingAddress: params.billingAddress,
        createdAt: now,
        updatedAt: now,
      };
      // WHEN
      const result = await service.execute(params);

      // THEN
      expect(result.props()).toMatchObject(expected);
    });
    describe("given invalid DTO", () => {
      it("should throw FailedToPlaceSalesOrderException", async () => {
        // GIVEN
        // const mockVariant: CatalogVariant = mockCatalogVariant();
        // let skuSpy = jest
        //   .spyOn(catalogService, "loadVariantBySku")
        //   .mockResolvedValue(mockVariant);
        const params = newMockInvalidCreateSalesOrderDto();
        params.user = newMockUser();
        params.accountId = params.user.account.id;
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'null': CatalogVariant not found for LineItem '1'.",
            timestamp: now,
            error: "MissingLineItem",
            details: {
              orderName: null,
              orderNumber: null,
              reason: "CatalogVariant not found for LineItem '1'.",
              inner: [
                {
                  sku: "MU-C004-00-18-Black",
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'null': CatalogVariant not found for LineItem '1'.",
          name: "FailedToPlaceSalesOrderException",
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.execute(params)
        );
        console.log(safeJsonStringify(error, null, 2));
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });
});

function newMockUser() {
  return new AuthenticatedUser({
    email: "mockUser@email.com",
    id: "MOCK_USER_ID",
    metadata: {
      accounts: [
        {
          companyCode: "MOCK_COMPANY_CODE",
          id: "MOCK_ACCOUNT_ID",
          name: "Mock Company",
          permissions: ["manage:orders"],
          roles: [],
        },
      ],
      authorization: {},
    },
  });
}

function mockCatalogVariant(): CatalogVariant {
  const customOptionTop: ICustomOptionProps = {
    maxLength: 12,
    pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
    type: "input",
    required: true,
    label: "Top Text",
    placeholder: "Enter up to 12 characters",
    name: "top_text",
  };
  const customOptionBottom: ICustomOptionProps = {
    maxLength: 12,
    pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
    type: "input",
    required: true,
    label: "Bottom Text",
    placeholder: "Enter up to 12 characters",
    name: "bottom_text",
  };
  return {
    id: "MOCK_ID",
    sku: "MOCK_SKU",
    image: "MOCK_IMAGE",
    svg: "MOCK_SVG",
    type: "MOCK_TYPE",
    option1: { enabled: true, name: "Size", option: "12" },
    option2: { enabled: true, name: "Color", option: "Black" },
    option3: null,
    productionData: null,
    personalizationRules: [customOptionTop, customOptionBottom],
    manufacturingCost: { total: 11, currency: "USD" },
    shippingCost: { total: 11, currency: "USD" },
    weight: { dimension: 120, units: "oz" },
  };
}

function newMockCreateSalesOrderDto() {
  const mockAccountId = mockUuid1;
  const mockShipping = mockAddress;
  const mockBilling = mockAddress;
  const mockLi1 = cloneDeep(mockLineItem);
  mockLi1.sku = mockCatalogVariant1.sku;
  mockLi1.lineItemProperties = [
    { name: mockTopText, value: "ValidText" },
    { name: mockMiddleText, value: "ValidText" },
    { name: mockBottomText, value: "ValidText" },
    { name: mockInitial, value: "M" },
  ];
  const mockAuthUser = new AuthenticatedUser({
    email: "sample@mail.com",
    id: "userId",
    metadata: { accounts: [], authorization: {} },
  });
  const mockDto: CreateSalesOrderDto = {
    accountId: mockAccountId,
    orderName: mockOrderName1,
    orderDate: now,
    orderNumber: mockOrderNumber1,
    customer: mockCustomer,
    lineItems: [mockLi1],
    shippingAddress: mockShipping,
    billingAddress: mockBilling,
    user: mockAuthUser,
  };
  const mockSalesOrderDto1: CreateOrderDto = cloneDeep(createSalesOrderDto);
  const mockSalesOrder1 = SalesOrder.create(mockSalesOrderDto1);
  return mockDto;
}
function newMockInvalidCreateSalesOrderDto() {
  const mockAccountId = mockUuid1;
  const mockShipping = mockAddress;
  const mockBilling = mockAddress;
  const mockLi1 = cloneDeep(mockLineItem);
  mockLi1.sku = mockCatalogVariant1.sku;
  mockLi1.lineItemProperties = [
    { name: mockTopText, value: "ValidText" },
    { name: mockMiddleText, value: "ValidText" },
    { name: mockBottomText, value: "ValidText" },
    { name: mockInitial, value: "M" },
  ];
  const mockAuthUser = new AuthenticatedUser({
    email: "sample@mail.com",
    id: "userId",
    metadata: { accounts: [], authorization: {} },
  });
  const mockDto: CreateSalesOrderDto = {
    accountId: mockAccountId,
    orderName: null,
    orderDate: null,
    orderNumber: null,
    customer: null,
    lineItems: [mockLi1],
    shippingAddress: null,
    billingAddress: null,
    user: mockAuthUser,
  };
  const mockSalesOrderDto1: CreateOrderDto = cloneDeep(createSalesOrderDto);
  const mockSalesOrder1 = SalesOrder.create(mockSalesOrderDto1);
  return mockDto;
}
