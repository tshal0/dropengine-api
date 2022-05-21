import { MESMetalArtMocks } from "@catalog/mocks";
import { mockAddress, mockCustomer, mockUuid1 } from "@sales/mocks";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { SalesOrderPlaced, OrderPlacedDetails } from "./OrderPlaced";
import { EventSchemaVersion } from "./SalesOrderEvent";
spyOnDate();
describe("OrderPlacedEvent", () => {
  it("should be generated with valid OrderPlacedDetails", () => {
    const liprops = cloneDeep(MongoMocks.lineItemProps);
    const payload = new OrderPlacedDetails({
      accountId: mockUuid1,
      billingAddress: mockAddress,
      shippingAddress: mockAddress,
      customer: mockCustomer,
      orderDate: now,
      orderName: "SLI-1001",
      orderNumber: 1001,
      lineItems: [
        {
          lineNumber: liprops.lineNumber,
          quantity: liprops.quantity,
          variant: liprops.variant,
          properties: liprops.personalization,
        },
      ],
    });
    let event = new SalesOrderPlaced(MongoMocks.mockMongoId, payload);

    const expected = {
      aggregateId: MongoMocks.mockMongoId,
      aggregateType: "SalesOrder",
      details: {
        accountId: mockUuid1,
        billingAddress: mockAddress,
        customer: mockCustomer,
        lineItems: [
          {
            lineNumber: 1,
            quantity: 1,
            properties: [
              {
                name: "Top Text",
                value: "Sample",
              },
              {
                name: "Bottom Text",
                value: "Sample",
              },
            ],
            variant: liprops.variant,
          },
        ],
        orderDate: now,
        orderName: "SLI-1001",
        orderNumber: 1001,
        shippingAddress: mockAddress,
      },
      eventId: expect.anything(),
      eventName: "Sales.OrderPlaced",
      eventType: "SalesOrderPlaced",
      eventVersion: "v1",
      timestamp: now,
    };
    expect(event).toEqual(expected);
  });
});
