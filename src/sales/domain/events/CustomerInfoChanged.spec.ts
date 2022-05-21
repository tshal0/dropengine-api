import { mockUuid1 } from "@sales/mocks";

import { v4 as uuidv4 } from "uuid";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { EditCustomerDto } from "@sales/api";
import { CustomerInfoChanged } from "./CustomerInfoChanged";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);
spyOnDate();
describe("CustomerInfoChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid CustomerInfoChanged event", () => {
      // GIVEN valid DTO

      const mockDto = new EditCustomerDto();
      mockDto.email = "test@sample.com";
      mockDto.name = "ChangedName";

      // WHEN

      let result = new CustomerInfoChanged(MongoMocks.mockMongoId, mockDto);

      const expected: CustomerInfoChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.CustomerInfoChanged,
        eventType: "CustomerInfoChanged",
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
