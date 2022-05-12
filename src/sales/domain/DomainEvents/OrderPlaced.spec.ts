import { CreateOrderDto } from "@sales/dto";
import { mockUuid1 } from "@sales/mocks";
import { SalesOrderPlaced } from "./OrderPlaced";

import { v4 as uuidv4 } from "uuid";
import {
  expectedCreateOrderDto,
  mockCreateOrderDto,
  mockCreateOrderDtoLineItems,
  mockOrderId,
  now,
} from "../../dto/CreateOrderDto.mock";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("SalesOrderPlaced", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid SalesOrderPlaced event", () => {
      // GIVEN valid DTO

      const createOrderDto: CreateOrderDto = new CreateOrderDto(
        mockCreateOrderDto
      );
      createOrderDto.applyLineItems(mockCreateOrderDtoLineItems);

      // WHEN

      let result = new SalesOrderPlaced(mockOrderId, createOrderDto);

      const expected: SalesOrderPlaced = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.OrderPlaced,
        eventType: "SalesOrderPlaced",
        details: expectedCreateOrderDto,
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
