import { mockAddress, mockUuid1 } from "@sales/mocks";

import { v4 as uuidv4 } from "uuid";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { ShippingAddressChanged } from "./ShippingAddressChanged";
import { UpdateShippingAddressDto } from "@sales/useCases";
import { EditShippingAddressDto } from "@sales/api";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);
spyOnDate();
describe("ShippingAddressChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid ShippingAddressChanged event", () => {
      // GIVEN valid DTO

      const mockDto = new EditShippingAddressDto();
      mockDto.shippingAddress = mockAddress;
      // WHEN

      let result = new ShippingAddressChanged(MongoMocks.mockMongoId, mockDto);

      const expected: ShippingAddressChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.ShippingAddressChanged,
        eventType: "ShippingAddressChanged",
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
