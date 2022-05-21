import { mockUuid1 } from "@sales/mocks";
import { SalesOrderCanceled } from "./OrderCanceled";

import { v4 as uuidv4 } from "uuid";

import {
  CancelOrderDto,
  CancelOrderRequesterDto,
} from "@sales/dto/CancelOrderDto";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);
spyOnDate();
describe("SalesOrderCanceled", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid SalesOrderCanceled event", () => {
      // GIVEN valid DTO

      const mockDto = new CancelOrderDto();
      mockDto.canceledAt = now;
      const requester = new CancelOrderRequesterDto();
      requester.name = "TestName";
      requester.email = "test@sample.com";
      mockDto.requestedBy = requester;

      // WHEN

      let result = new SalesOrderCanceled(MongoMocks.mockMongoId, mockDto);

      const expected: SalesOrderCanceled = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.OrderCanceled,
        eventType: "SalesOrderCanceled",
        details: mockDto,
        aggregateType: "SalesOrder",
        aggregateId: MongoMocks.mockMongoId,
        timestamp: now,
        eventVersion: EventSchemaVersion.v1,
      };
      // THEN

      expect(result).toEqual(expected);
    });
  });
});
