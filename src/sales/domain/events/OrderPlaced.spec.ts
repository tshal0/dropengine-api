import { mockAddress, mockUuid1 } from "@sales/mocks";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { SalesOrderMocks } from "@sales/mocks/SalesOrderMocks.mock";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { SalesOrderPlaced, OrderPlacedDetails } from "./OrderPlaced";
spyOnDate();
describe("OrderPlacedEvent", () => {
  it("should be generated with valid OrderPlacedDetails", () => {
    const liprops = cloneDeep(MongoMocks.lineItemProps);
    const payload = new OrderPlacedDetails({
      seller: mockUuid1,
      billingAddress: mockAddress,
      shippingAddress: mockAddress,
      customer: cloneDeep(SalesOrderMocks.customer),
      merchant: cloneDeep(SalesOrderMocks.merchant),
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
    expect(payload.customer).toEqual(SalesOrderMocks.customer);
    expect(payload.merchant).toEqual(SalesOrderMocks.merchant);
    let event = new SalesOrderPlaced(MongoMocks.mockMongoId, payload);

    const expected = {
      aggregateId: MongoMocks.mockMongoId,
      aggregateType: "SalesOrder",
      details: {
        seller: mockUuid1,
        billingAddress: mockAddress,
        customer: SalesOrderMocks.customer,
        merchant: SalesOrderMocks.merchant,
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
