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
import safeJsonStringify from "safe-json-stringify";
import axios from "axios";
let server;

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
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {};
          return true;
        },
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
    // request(server).trace("/api/v1/orders", (err, res) => {
    //   console.log(safeJsonStringify({ err, res }, null, 2));
    // });
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
async function loadAccessToken() {
  const options = generateTokenRequestOptions();
  const resp = await postAuth(options);

  const accessToken = extractAccessToken(resp);
  return accessToken;
}
function extractAccessToken(resp: {
  code: number;
  object: { access_token: string };
}): any {
  return resp?.object?.access_token;
}
function generateTokenRequestOptions() {
  const accessTokenUrl = process.env.AUTH0_ACCESS_TOKEN_URL;

  const payload = generateTokenRequestPayload();
  return {
    method: "POST",
    url: accessTokenUrl,
    headers: { "content-type": "application/json" },
    body: payload,
    json: true,
  };
}
function generateTokenRequestPayload() {
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_API_AUDIENCE;
  const grantType = process.env.AUTH0_GRANT_TYPE;
  const userName = process.env.AUTH0_USERNAME;
  const userPass = process.env.AUTH0_PASSWORD;
  return {
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    scope: "token id_token openid profile email",
    username: userName,
    password: userPass,
    grant_type: grantType,
  };
}

export interface AuthRequestResponse {
  code: number;
  object: {
    access_token: string;
  };
}
export async function postAuth(options): Promise<AuthRequestResponse> {
  let resp = await axios({
    url: options.url,
    data: options.body,
    headers: options.headers,
    method: options.method,
  })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
  return { code: resp.status, object: resp.data };
}
