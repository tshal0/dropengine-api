import { mockAddress, mockUuid1 } from "@sales/mocks";

import { v4 as uuidv4 } from "uuid";
import { mockOrderId, now } from "../../dto/CreateOrderDto.mock";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { ShippingAddressChanged } from "./ShippingAddressChanged";
import { UpdateShippingAddressDto } from "@sales/useCases";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("ShippingAddressChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid ShippingAddressChanged event", () => {
      // GIVEN valid DTO

      const mockDto = new UpdateShippingAddressDto();
      mockDto.orderId = mockOrderId;
      mockDto.shippingAddress = mockAddress;
      // WHEN

      let result = new ShippingAddressChanged(mockOrderId, mockDto);

      const expected: ShippingAddressChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.ShippingAddressChanged,
        eventType: "ShippingAddressChanged",
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
