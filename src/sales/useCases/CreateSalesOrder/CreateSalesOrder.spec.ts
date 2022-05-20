import { TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { now, spyOnDate } from "@shared/mocks";

import { CreateOrderLineItemApiDto } from "@sales/api";
import { CreateLineItemDto, CreateOrderDto, CustomerDto } from "@sales/dto";

import {
  mockSalesModule,
  mockCatalogVariant,
  newMockCreateSalesOrderDto,
  newMockInvalidCreateSalesOrderDto,
  mockCatalogVariant1,
} from "@sales/mocks";

import { MongoOrdersRepository } from "@sales/database/mongo/repositories/MongoOrdersRepository";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";
import { CreateSalesOrderDto } from "@sales/dto/CreateSalesOrderDto";
import { CreateSalesOrder } from "./CreateSalesOrder";
import { CreateSalesOrderError } from "./CreateSalesOrderError";
import { FailedToPlaceSalesOrderException } from "./FailedToPlaceSalesOrderException";
import {
  MongoSalesOrderDocument,
  MongoSalesOrder,
} from "@sales/database/mongo";
import {
  CatalogService,
  CatalogServiceError,
  FailedToLoadVariantByIdException,
  FailedToLoadMyEasySuiteVariantException,
} from "@catalog/services/CatalogService";
import { CatalogVariant } from "@catalog/services";
spyOnDate();
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

      const catalogServiceException = new FailedToLoadMyEasySuiteVariantException(
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
      const params: CreateOrderDto = new CreateOrderDto();
      params.accountId = mockDto.accountId;
      params.orderName = mockDto.orderName;
      params.orderDate = mockDto.orderDate;
      params.orderNumber = mockDto.orderNumber;
      params.customer = mockDto.customer;
      params.shippingAddress = mockDto.shippingAddress;
      params.billingAddress = mockDto.billingAddress;
      params.lineItems = mockDto.lineItems.map((li, i) => {
        let nli = new CreateLineItemDto();
        nli.lineNumber = i + 1;
        nli.properties = li.lineItemProperties;
        nli.quantity = li.quantity;
        nli.variant = mockCatalogVariant1;
        return nli;
      });
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
        params.orderName = null;
        params.orderDate = null;
        params.orderNumber = null;
        params.customer = new CustomerDto();
        params.customer.email = null;
        params.customer.name = null;
        const mockLi: CreateLineItemDto = new CreateLineItemDto();
        mockLi.lineNumber = null;
        mockLi.quantity = null;
        mockLi.variant = null;
        mockLi.properties = null;
        params.lineItems = [mockLi];
        params.shippingAddress = null;
        params.billingAddress = null;

        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'null': Validation errors found.",
            timestamp: now,
            error: "InvalidSalesOrder",
            details: {
              orderName: null,
              orderNumber: null,
              reason: "Validation errors found.",
              inner: [
                {
                  property: "orderName",
                  message:
                    "orderName should not be empty; orderName must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderDate",
                  message:
                    "orderDate should not be empty; orderDate must be a Date instance",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderNumber",
                  message:
                    "orderNumber should not be empty; orderNumber must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "customer.name",
                  message: "name should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "customer.email",
                  message: "email should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "lineItems.0.lineNumber",
                  message:
                    "lineNumber should not be empty; lineNumber must be a number conforming to the specified constraints",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "lineItems.0.quantity",
                  message:
                    "quantity should not be empty; quantity must be a number conforming to the specified constraints",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "lineItems.0.variant",
                  message: "variant should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "lineItems.0.properties",
                  message:
                    "properties must be an array; properties should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress",
                  message: "shippingAddress should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress",
                  message:
                    "nested property shippingAddress must be either object or array",
                  type: "SalesOrderValidationError",
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'null': Validation errors found.",
          name: "FailedToPlaceSalesOrderException",
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
                  message:
                    "accountId should not be empty; accountId must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderDate",
                  message:
                    "orderDate must be a Date instance; orderDate should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderNumber",
                  message: "orderNumber should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "customer",
                  message: "customer should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "lineItems",
                  message: "lineItems must be an array",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress",
                  message: "shippingAddress should not be empty",
                  type: "SalesOrderValidationError",
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

        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });

  describe("execute", () => {
    it("should work", async () => {
      // GIVEN
      const mockVariant: CatalogVariant = mockCatalogVariant();
      let skuSpy = jest
        .spyOn(catalogService, "loadVariantBySku")
        .mockResolvedValue(mockVariant);
      let dto = newMockCreateSalesOrderDto();

      const expected = {
        accountId: dto.accountId,
        orderName: dto.orderName,
        orderNumber: +dto.orderNumber,
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
          },
        ],
        customer: dto.customer,
        shippingAddress: dto.shippingAddress,
        billingAddress: dto.billingAddress,
        createdAt: now,
        updatedAt: now,
      };
      // WHEN
      const result = await service.execute(dto);

      // THEN
      expect(result.props()).toMatchObject(expected);
    });
    describe("given invalid DTO", () => {
      it("should throw FailedToPlaceSalesOrderException", async () => {
        // GIVEN
        const mockVariant: CatalogVariant = mockCatalogVariant();
        let skuSpy = jest
          .spyOn(catalogService, "loadVariantBySku")
          .mockResolvedValue(mockVariant);
        const params = newMockInvalidCreateSalesOrderDto();
        const invalidCustomerDto = new CustomerDto();
        invalidCustomerDto.email = null;
        invalidCustomerDto.name = null;
        params.customer = invalidCustomerDto;

        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'null': Validation errors found.",
            timestamp: now,
            error: "InvalidSalesOrder",
            details: {
              orderName: null,
              orderNumber: null,
              reason: "Validation errors found.",
              inner: [
                {
                  property: "orderName",
                  message:
                    "orderName should not be empty; orderName must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderDate",
                  message:
                    "orderDate should not be empty; orderDate must be a Date instance",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "orderNumber",
                  message:
                    "orderNumber should not be empty; orderNumber must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "customer.name",
                  message: "name should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "customer.email",
                  message: "email should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.zip",
                  message: "zip must be a string; zip should not be empty",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.city",
                  message: "city should not be empty; city must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.name",
                  message: "name should not be empty; name must be a string",
                  type: "SalesOrderValidationError",
                },

                {
                  property: "shippingAddress.address1",
                  message:
                    "address1 should not be empty; address1 must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.province",
                  message:
                    "province should not be empty; province must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.lastName",
                  message:
                    "lastName should not be empty; lastName must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.countryCode",
                  message:
                    "countryCode should not be empty; countryCode must be a string",
                  type: "SalesOrderValidationError",
                },
                {
                  property: "shippingAddress.provinceCode",
                  message:
                    "provinceCode should not be empty; provinceCode must be a string",
                  type: "SalesOrderValidationError",
                },
              ],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'null': Validation errors found.",
          name: "FailedToPlaceSalesOrderException",
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.execute(params)
        );
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
    describe("given unknown error thrown", () => {
      it("should throw FailedToPlaceSalesOrderException", async () => {
        // GIVEN
        const mockVariant: CatalogVariant = mockCatalogVariant();
        let skuSpy = jest
          .spyOn(catalogService, "loadVariantBySku")
          .mockResolvedValue(mockVariant);
        const params = newMockCreateSalesOrderDto();
        const saveSpy = jest.spyOn(salesRepo, "save").mockImplementation(() => {
          throw "Unexpected Error";
        });
        const expected = {
          response: {
            statusCode: 500,
            message:
              "Failed to place SalesOrder for order 'SLI-10000000001': An unexpected error has occurred.",
            timestamp: now,
            error: CreateSalesOrderError.UnknownSalesError,
            details: {
              orderName: "SLI-10000000001",
              orderNumber: "1001",
              reason: "An unexpected error has occurred.",
              inner: [],
            },
          },
          status: 500,
          message:
            "Failed to place SalesOrder for order 'SLI-10000000001': An unexpected error has occurred.",
          name: FailedToPlaceSalesOrderException.name,
        };
        // WHEN
        // THEN
        const error: any = await getAsyncError(
          async () => await service.execute(params)
        );
        // THEN
        expect(error).not.toBeInstanceOf(NoErrorThrownError);
        expect(error).toBeInstanceOf(FailedToPlaceSalesOrderException);
        expect(error.getResponse()).toEqual(expected.response);
        expect(error.name).toEqual(expected.name);
      });
    });
  });
});
