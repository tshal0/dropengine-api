import { mockUuid1 } from "@sales/mocks";

import { v4 as uuidv4 } from "uuid";
import { EventSchemaVersion, SalesOrderEventName } from "./SalesOrderEvent";
import { CustomerInfoChanged } from "./CustomerInfoChanged";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
import { SalesOrderMocks } from "@sales/mocks/SalesOrderMocks.mock";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);
spyOnDate();
describe("CustomerInfoChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid CustomerInfoChanged event", () => {
      // GIVEN valid DTO
      const details = { customer: SalesOrderMocks.customer };
      // WHEN

      let result = new CustomerInfoChanged(MongoMocks.mockMongoId, details);

      const expected: CustomerInfoChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.CustomerInfoChanged,
        eventType: "CustomerInfoChanged",
        details: details,
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
