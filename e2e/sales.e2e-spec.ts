import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { WinstonModule } from "nest-winston";
import { loadAccessToken } from "./utils";
import { AppModule } from "../src/app.module";
import { MikroORM } from "@mikro-orm/core";

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

  it("/orders/:id/lineItems/:lid (PATCH)", () => {
    // Edit Personalization
    const server: INestApplication = app.getHttpServer();
    const payload = {};
    const expected = {};
    const id = "123";
    const lineNumber = "123";
    return request(server)
      .patch(`/orders/${id}/lineItems/${lineNumber}`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200)
      .expect(expected);
  });
  it("/orders/:id/shippingAddress (PATCH)", () => {
    // Edit ShippingAddress
    const server: INestApplication = app.getHttpServer();
    const payload = {};
    const expected = {};
    const id = "123";
    const lineNumber = "123";
    return request(server)
      .patch(`/orders/${id}/shippingAddress`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200)
      .expect(expected);
  });
  it("/orders/:id/customer (PATCH)", () => {
    // Edit Customer
    const server: INestApplication = app.getHttpServer();
    const payload = {};
    const expected = {};
    const id = "123";
    const lineNumber = "123";
    return request(server)
      .patch(`/orders/${id}/customer`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200)
      .expect(expected);
  });
  it("/orders/:id/send (POST)", () => {
    // Send To Manufacturer
    const server: INestApplication = app.getHttpServer();
    const payload = {};
    const expected = {};
    const id = "123";
    const lineNumber = "123";
    return request(server)
      .post(`/orders/${id}/send`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200)
      .expect(expected);
  });
  it("/orders/:id/recall (POST)", () => {
    // Recall From Manufacturer
    const server: INestApplication = app.getHttpServer();
    const payload = {};
    const expected = {};
    const id = "123";
    const lineNumber = "123";
    return request(server)
      .post(`/orders/${id}/recall`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200)
      .expect(expected);
  });
  afterAll(async () => {
    if (app) await app.close();
  });
});
