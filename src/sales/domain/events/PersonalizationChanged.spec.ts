import { mockTopText, mockUuid1 } from "@sales/mocks";
import { PersonalizationChanged } from "./PersonalizationChanged";

import { v4 as uuidv4 } from "uuid";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { UpdatePersonalizationDto } from "@sales/dto/UpdatePersonalizationDto";
import { now, spyOnDate } from "@shared/mocks";
import { MongoMocks } from "@sales/mocks/MongoMocks";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);
spyOnDate();
describe("PersonalizationChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid PersonalizationChanged event", () => {
      // GIVEN valid DTO
      const mockDto = new UpdatePersonalizationDto();
      mockDto.lineNumber = 1;
      mockDto.orderId = mockUuid1;
      mockDto.personalization = [{ name: mockTopText, value: "ValidText" }];

      // WHEN

      let result = new PersonalizationChanged(MongoMocks.mockMongoId, mockDto);

      const expected: PersonalizationChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.PersonalizationChanged,
        eventType: "PersonalizationChanged",
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
