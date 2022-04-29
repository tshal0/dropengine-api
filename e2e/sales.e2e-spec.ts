import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { loadAccessToken } from "./loadAccessToken";
import { AppModule } from "../src/app.module";
import { winstonLoggerOptions } from "@shared/modules/winston-logger/winstonLogger";
import { WinstonModule } from "nest-winston";

/** MOCK UTILS */
jest.setTimeout(60000);
describe("Sales (e2e)", () => {
  let app: INestApplication;
  let token: string = "NOT_AVAILABLE";
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const logger = WinstonModule.createLogger(winstonLoggerOptions);
    module.useLogger(logger);
    await app.init();
    app.useLogger(logger);
    AppModule.register({
      mikroOrmOptions: {
        dbName: "./e2e/test.sqlite3",
        type: "sqlite",
        baseDir: "./e2e",
      },
    });
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
    if (app) await app.close();
  });
});
