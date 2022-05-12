import { CreateOrderDto } from "@sales/dto";
import { mockAddress, mockUuid1 } from "@sales/mocks";
import { spyOnDate } from "@shared/mocks";
import moment from "moment";
import safeJsonStringify from "safe-json-stringify";

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
import { EditCustomerDto } from "@sales/api";
import { CustomerInfoChanged } from "./CustomerInfoChanged";
jest.mock("uuid");
uuidv4.mockImplementation(() => mockUuid1);

describe("CustomerInfoChanged", () => {
  beforeAll(async () => {});
  describe("given a valid DTO", () => {
    it("should generate a valid CustomerInfoChanged event", () => {
      // GIVEN valid DTO

      const mockDto = new EditCustomerDto();
      mockDto.email = "test@sample.com";
      mockDto.name = "ChangedName";

      // WHEN

      let result = new CustomerInfoChanged(mockOrderId, mockDto);

      const expected: CustomerInfoChanged = {
        eventId: mockUuid1,
        eventName: SalesOrderEventName.CustomerInfoChanged,
        eventType: "CustomerInfoChanged",
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
