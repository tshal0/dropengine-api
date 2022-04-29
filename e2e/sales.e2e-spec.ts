import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, INestApplication } from "@nestjs/common";
import request from "supertest";
import { SalesModule } from "@sales/sales.module";
import { CatalogModule } from "@catalog/catalog.module";
import { rootMongooseTestModule } from "@jestconfig/mongodb-memory-server";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { AuthModule } from "@shared/modules";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DbProduct, DbProductType, DbProductVariant } from "@catalog/domain";
import { DbAccount } from "@accounts/domain/entities/Account.entity";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import { ProductTypesRepository } from "@catalog/database";
import { MikroORM } from "@mikro-orm/core";
import { DbStore } from "@accounts/domain/entities/Store.entity";
import { loadAccessToken } from "./loadAccessToken";

/** MOCK UTILS */

describe("Sales (e2e)", () => {
  let app: INestApplication;
  let token: string = "NOT_AVAILABLE";
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        rootMongooseTestModule(),
        // MongooseModule.forFeature([
        //   { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
        // ]),
        // HttpModule,
        // ConfigModule.forRoot(),
        // AzureTelemetryModule,
        MikroOrmModule.forRoot({
          dbName: "./e2e/test.sqlite3",
          type: "sqlite",
          baseDir: "./e2e",
          entities: [
            DbProduct,
            DbProductType,
            DbProductVariant,
            DbAccount,
            DbStore,
          ],
        }),
        AuthModule,
        CatalogModule,
        SalesModule,
      ],
      providers: [
        { provide: MikroORM, useValue: {} },
        { provide: SqlEntityManager, useValue: {} },
        {
          provide: ProductTypesRepository,
          useValue: {},
        },
        // {
        //   provide: getRepositoryToken(DbProductType),
        //   useValue: {},
        // },
        // {
        //   provide: getRepositoryToken(DbProduct),
        //   useValue: {},
        // },
        // {
        //   provide: getRepositoryToken(DbProductVariant),
        //   useValue: {},
        // },
        // {
        //   provide: getRepositoryToken(DbAccount),
        //   useValue: {},
        // },
      ],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    token = await loadAccessToken();
  });
  beforeEach(async () => {});

  it("/orders (GET)", () => {
    const server: INestApplication = app.getHttpServer();

    const expected = {
      total: 0,
      page: 0,
      pages: 0,
      size: 100,
      options: [],
      data: [],
    };

    return request(server)
      .get("/orders")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(expected);
  });
  afterAll(async () => {
    await app.close();
  });
});
