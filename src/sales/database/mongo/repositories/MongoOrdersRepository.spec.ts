import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import { MESMetalArtMocks } from "@catalog/mocks";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  ISalesOrder,
  ISalesOrderProps,
  OrderStatus,
  SalesOrder,
} from "@sales/domain";
import {
  ISalesLineItemProps,
  SalesLineItem,
} from "@sales/domain/model/SalesLineItem";
import { mockUuid1 } from "@sales/mocks";
import { mockSalesModule } from "@sales/mocks/sales.module.mock";
import { Address, IAddress } from "@shared/domain";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import { MongoSalesOrder, MongoSalesOrderDocument } from "../schemas";
import { MongoOrdersRepository } from "./MongoOrdersRepository";

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
  static readonly lineItemProps: ISalesLineItemProps = {
    lineNumber: 1,
    quantity: 1,
    variant: cloneDeep(MESMetalArtMocks.expectedCatalogVariant),
    personalization: [
      { name: "Top Text", value: "Sample" },
      { name: "Bottom Text", value: "Sample" },
    ],
    flags: [],
  };
  static readonly lineItem: SalesLineItem = new SalesLineItem(
    cloneDeep(MongoMocks.lineItemProps)
  );
  private static readonly mockMongoId = "000000000000000000000001";
  static readonly orderProps: ISalesOrderProps = {
    id: MongoMocks.mockMongoId,
    accountId: mockUuid1,
    orderName: "SLI-1001",
    orderNumber: 1001,
    orderDate: now,
    orderStatus: OrderStatus.OPEN,
    lineItems: [cloneDeep(MongoMocks.lineItemProps)],
    customer: { email: "sample@mail.com", name: "SampleCustomer" },
    shippingAddress: cloneDeep(MongoMocks.addressProps),
    billingAddress: cloneDeep(MongoMocks.addressProps),
    updatedAt: now,
    createdAt: now,
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
        variant: MESMetalArtMocks.expectedCatalogVariant,
      },
    ],
    shippingAddress: MongoMocks.addressProps,
    updatedAt: now,
    createdAt: now,
  };
}

// spyOnDate();
describe("MongoOrdersRepository", () => {
  let module: TestingModule;
  let service: MongoOrdersRepository;
  let model: Model<MongoSalesOrderDocument>;

  beforeEach(async () => {
    module = await mockSalesModule()
      .overrideProvider(getRepositoryToken(DbProductType))
      .useValue({})
      .overrideProvider(getRepositoryToken(DbProduct))
      .useValue({})
      .overrideProvider(getRepositoryToken(DbProductVariant))
      .useValue({})
      .overrideProvider(AccountsRepository)
      .useValue({})
      .overrideProvider(StoresRepository)
      .useValue({})
      .compile();

    service = await module.resolve(MongoOrdersRepository);
    const modelToken = getModelToken(MongoSalesOrder.name);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
  });
  afterAll(async () => {
    await closeMongoConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create correct document", async () => {
      let toBeCreated = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));
      let doc = await service.create(toBeCreated);
      const raw = doc.raw();
      const expected = cloneDeep(MongoMocks.expectedOrderProps);
      expected.id = raw.id;
      expect(raw).toEqual(expected);
    });
  });
  describe("findByIdAndUpdateOrCreate", () => {
    it("should update if document exists", () => {});
    it("should create if document not found", () => {});
  });
});
