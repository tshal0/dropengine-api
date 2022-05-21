import { mockUuid1 } from "@sales/mocks";
import { ShipmentAdded } from "./ShipmentAdded";

import { v4 as uuidv4 } from "uuid";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { AddShipmentDto, IAddShipmentDto } from "@sales/dto/AddShipmentDto";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
jest.mock("uuid");
spyOnDate();
uuidv4.mockImplementation(() => mockUuid1);

describe("ShipmentAdded", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid ShipmentAdded event", () => {
      const dto: IAddShipmentDto = {
        orderId: MongoMocks.mockMongoId,
        orderName: "MOCK",
        orderNumber: "MOCK",
        shipstationOrderId: "MOCK",
        shipstationOrderKey: "MOCK",
        shipmentId: "MOCK",
        shippedAt: now,
        trackingNumber: "MOCK",
        carrierCode: "MOCK",
        serviceCode: "MOCK",
        packageCode: "MOCK",
        confirmation: "MOCK",
        warehouseId: 0,
        shipmentCost: 0,
        userId: "MOCK",
      };
      // GIVEN valid DTO

      const mockDto = new AddShipmentDto(dto);

      // WHEN

      let result = new ShipmentAdded(MongoMocks.mockMongoId, mockDto);

      const expected: ShipmentAdded = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.ShipmentAdded,
        eventType: "ShipmentAdded",
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
