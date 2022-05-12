import { CreateOrderDto } from "@sales/dto";
import { mockAddress, mockUuid1 } from "@sales/mocks";
import { spyOnDate } from "@shared/mocks";
import moment from "moment";
import safeJsonStringify from "safe-json-stringify";
import { SalesOrderCanceled } from "./OrderCanceled";

import { v4 as uuidv4 } from "uuid";
import {
  expectedCreateOrderDto,
  mockCreateOrderDto,
  mockCreateOrderDtoLineItems,
  mockOrderId,
  now,
} from "../../dto/CreateOrderDto.mock";
import {
  CancelOrderDto,
  CancelOrderRequesterDto,
} from "@sales/dto/CancelOrderDto";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("SalesOrderCanceled", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid SalesOrderCanceled event", () => {
      // GIVEN valid DTO

      const mockDto = new CancelOrderDto();
      mockDto.cancelledAt = now;
      const requester = new CancelOrderRequesterDto();
      requester.name = "TestName";
      requester.email = "test@sample.com";
      mockDto.requestedBy = requester;

      // WHEN

      let result = new SalesOrderCanceled(mockOrderId, mockDto);

      const expected: SalesOrderCanceled = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.OrderCanceled,
        eventType: "SalesOrderCanceled",
        details: mockDto,
        aggregateType: "SalesOrder",
        aggregateId: mockOrderId,
        timestamp: now,
        eventVersion: EventSchemaVersion.v1,
      };
      // THEN

      expect(result).toEqual(expected);
    });
  });
});
