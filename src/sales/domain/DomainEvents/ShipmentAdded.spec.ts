import { mockUuid1 } from "@sales/mocks";
import { ShipmentAdded } from "./ShipmentAdded";

import { v4 as uuidv4 } from "uuid";
import { mockOrderId, now } from "../../dto/CreateOrderDto.mock";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { AddShipmentDto, IAddShipmentDto } from "@sales/dto/AddShipmentDto";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("SalesOrderShipmentAdded", () => {
  beforeAll(async () => {});
  describe("given a valid CreateOrderDto", () => {
    it("should generate a valid SalesOrderPlace event", () => {
      const dto: IAddShipmentDto = {
        orderId: mockOrderId,
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

      let result = new ShipmentAdded(mockOrderId, mockDto);

      const expected: ShipmentAdded = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.ShipmentAdded,
        eventType: "ShipmentAdded",
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
