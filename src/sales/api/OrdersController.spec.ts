import { MESMetalArtMocks } from "@catalog/mocks";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import { MongoSalesOrderDocument, MongoSalesOrder } from "@sales/database";
import { OrderStatus } from "@sales/domain";
import { PlaceOrderRequest } from "@sales/features";
import { SalesOrderMocks, withDefaults } from "@sales/mocks";
import { AuthenticatedUser } from "@shared/decorators";
import { IRequestUser } from "@shared/decorators/IAuthenticatedUser";
import { now, nowStr } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import { OrdersController } from "./OrdersController";
import { CatalogService } from "@catalog/services";

describe("OrdersController", () => {
  let module: TestingModule;
  let service: OrdersController;
  let model: Model<MongoSalesOrderDocument>;

  beforeEach(async () => {
    module = await withDefaults().compile();
    service = await module.resolve<OrdersController>(OrdersController);
    const modelToken = getModelToken(MongoSalesOrder.name);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
  });
  afterAll(async () => {
    await closeMongoConnection();
  });
  it("should exist", () => {
    expect(service).toBeDefined();
  });

  describe("getById", () => {
    it("should return SalesOrder > OrderResponse", async () => {
      // GIVEN
      let toBeCreated = new MongoSalesOrder(
        cloneDeep(SalesOrderMocks.orderProps)
      );
      const v = MESMetalArtMocks.expectedCatalogVariant;
      const raw = toBeCreated.raw();
      let doc = await model.create(raw);

      // WHEN
      let result = await service.getById(doc.id);

      // THEN
      expect(result).toEqual({
        id: expect.anything(),
        accountId: SalesOrderMocks.accountId,
        billingAddress: SalesOrderMocks.billingAddress,
        customer: SalesOrderMocks.customer,
        lineItems: [SalesOrderMocks.salesLineItem1],
        orderDate: now,
        orderName: SalesOrderMocks.orderName,
        orderNumber: SalesOrderMocks.orderNumber,
        orderStatus: OrderStatus.OPEN,
        shippingAddress: SalesOrderMocks.shippingAddress,
      });
    });
  });

  describe("get", () => {});
  describe("patchPersonalization", () => {});
  describe("patchCustomer", () => {});
  describe("patchShippingAddress", () => {});
  describe("delete", () => {});
  describe("post", () => {
    describe("given valid PlaceOrderRequest", () => {
      beforeEach(() => {
        jest
          .spyOn(global.Date, "now")
          .mockImplementation(() => new Date(nowStr).valueOf());
      });
      it("should create SalesOrder and return OrderResponse", async () => {
        const lookupVariantFn = jest.fn();
        const catalogVariant = MESMetalArtMocks.expectedCatalogVariant;
        // GIVEN
        module = await withDefaults()
          .overrideProvider(CatalogService)
          .useValue({
            lookupVariantBySkuOrId:
              lookupVariantFn.mockResolvedValue(catalogVariant),
          })
          .compile();
        service = await module.resolve<OrdersController>(OrdersController);
        let request: PlaceOrderRequest = new PlaceOrderRequest({
          billingAddress: SalesOrderMocks.billingAddress,
          customer: cloneDeep(SalesOrderMocks.customer),
          merchant: cloneDeep(SalesOrderMocks.merchant),
          lineItems: [SalesOrderMocks.lineItem1 as any],
          orderDate: now,
          orderName: SalesOrderMocks.orderName,
          orderNumber: SalesOrderMocks.orderNumber,
          shippingAddress: SalesOrderMocks.shippingAddress,
          accountId: SalesOrderMocks.accountId,
        });

        const reqUser: IRequestUser = {
          email: "admin@mail.com",
          "https://www.drop-engine.com/email": "admin@mail.com",
          "https://www.drop-engine.com/app_metadata": {
            authorization: [],
            accounts: [
              {
                id: SalesOrderMocks.accountId,
                companyCode: "test_account",
                name: "Test Account",
                permissions: ["manage:orders"],
                roles: ["admin"],
              },
            ],
          },
          iss: "",
          sub: "",
          aud: [],
          iat: 0,
          exp: 0,
          azp: "",
          scope: "",
          gty: "",
          permissions: [],
        };
        const user = AuthenticatedUser.load(reqUser);
        const jsonFn = jest.fn();
        const statusFn = jest.fn().mockReturnValue({ json: jsonFn });
        // WHEN
        let result = await service.post(user, request);

        // THEN
        expect(result).toEqual({
          id: expect.anything(),
          accountId: SalesOrderMocks.accountId,
          billingAddress: SalesOrderMocks.billingAddress,
          customer: SalesOrderMocks.customer,
          lineItems: [SalesOrderMocks.salesLineItem1],
          orderDate: now,
          orderName: SalesOrderMocks.orderName,
          orderNumber: SalesOrderMocks.orderNumber,
          orderStatus: OrderStatus.OPEN,
          shippingAddress: SalesOrderMocks.shippingAddress,
        });
      });
    });
  });
});
