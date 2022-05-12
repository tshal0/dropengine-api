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
