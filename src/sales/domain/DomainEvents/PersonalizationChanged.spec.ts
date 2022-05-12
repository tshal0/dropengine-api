import { mockTopText, mockUuid1 } from "@sales/mocks";
import { PersonalizationChanged } from "./PersonalizationChanged";

import { v4 as uuidv4 } from "uuid";
import { mockOrderId, now } from "../../dto/CreateOrderDto.mock";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { AddShipmentDto, IAddShipmentDto } from "@sales/dto/AddShipmentDto";
import { UpdatePersonalizationDto } from "@sales/dto/UpdatePersonalizationDto";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("PersonalizationChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid PersonalizationChanged event", () => {
      // GIVEN valid DTO
      const mockDto = new UpdatePersonalizationDto();
      mockDto.lineItemId = mockUuid1;
      mockDto.orderId = mockUuid1;
      mockDto.personalization = [{ name: mockTopText, value: "ValidText" }];

      // WHEN

      let result = new PersonalizationChanged(mockOrderId, mockDto);

      const expected: PersonalizationChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.PersonalizationChanged,
        eventType: "PersonalizationChanged",
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
