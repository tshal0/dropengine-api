import { ProductTypes } from "@catalog/domain";
import { mockAddress, mockUuid1 } from "@sales/mocks";
import { Address, IAddress } from "@shared/domain";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { CustomerInfoChanged } from "../events/CustomerInfoChanged";
import { SalesOrderCanceled } from "../events/OrderCanceled";
import { OrderPlacedDetails } from "../events/OrderPlaced";
import { PersonalizationChanged } from "../events/PersonalizationChanged";
import { ShippingAddressChanged } from "../events/ShippingAddressChanged";
import { SalesCustomer } from "./SalesCustomer";
import { ISalesLineItemProps, SalesLineItem } from "./SalesLineItem";
import { ISalesOrderProps, OrderStatus, SalesOrder } from "./SalesOrder";
import { SalesOrderMocks } from "../../mocks/SalesOrderMocks.mock";

describe("SalesOrder", () => {
  const mockMongoId = `000000000000000000000001`;
  it("should exist", () => {
    let props: ISalesOrderProps = {
      id: null,
      accountId: null,
      orderName: "",
      orderNumber: 0,
      orderDate: now,
      orderStatus: OrderStatus.OPEN,
      lineItems: [],
      customer: { email: "", name: "" },
      shippingAddress: new Address().raw(),
      billingAddress: new Address().raw(),
      updatedAt: now,
      createdAt: now,
      events: [],
    };
    const result = new SalesOrder();
    expect(result.raw()).toEqual(props);
  });
  it("should take props", () => {
    const liProps = mockLineItemProps();

    let props: ISalesOrderProps = {
      id: mockMongoId,
      accountId: mockUuid1,
      orderName: "SLI-1001",
      orderNumber: 1001,
      orderDate: now,
      orderStatus: OrderStatus.OPEN,
      lineItems: [liProps],
      customer: { email: "sample@mail.com", name: "Sample" },
      shippingAddress: new Address(mockAddress).raw(),
      billingAddress: new Address().raw(),
      updatedAt: now,
      createdAt: now,
      events: [],
    };
    const result = new SalesOrder(props);
    expect(result.raw()).toEqual(props);
  });
  it("should not take invalid props", () => {
    const liProps = mockLineItemProps();

    let props: ISalesOrderProps = {
      id: "",
      accountId: "",
      orderName: "SLI-1001",
      orderNumber: 1001,
      orderDate: "" as any,
      orderStatus: OrderStatus.OPEN,
      lineItems: [liProps],
      customer: { email: "sample@mail.com", name: "Sample" },
      shippingAddress: new Address(mockAddress).raw(),
      billingAddress: new Address().raw(),
      updatedAt: now,
      createdAt: now,
      events: [],
    };
    let expected = cloneDeep(props);
    expected.id = null;
    expected.accountId = null;
    expected.orderDate = null;
    const result = new SalesOrder(props);
    expect(result.raw()).toEqual(expected);
  });

  it("should not allow non-Mongo ids", () => {
    let result = new SalesOrder();
    result.id = "";
    expect(result.id).toBe(null);
  });
  it("should not allow non-UUID accountId", () => {
    let result = new SalesOrder();
    result.accountId = "";
    expect(result.accountId).toBe(null);
  });
  it("should not allow non-Date orderDate", () => {
    let result = new SalesOrder();
    result.orderDate = "";
    expect(result.orderDate).toBe(null);
  });
  it("id should be editable", () => {
    let result = new SalesOrder();
    result.id = mockMongoId;
    expect(result.id).toEqual(mockMongoId);
  });
  it("accountId should be editable", () => {
    let result = new SalesOrder();
    result.accountId = mockUuid1;
    expect(result.accountId).toEqual(mockUuid1);
  });
  it("orderDate should be editable", () => {
    let result = new SalesOrder();
    const date = new Date("2022-06-04");
    result.orderDate = date;
    expect(result.orderDate).toEqual(date);
  });
  it("orderName should be editable", () => {
    let result = new SalesOrder();
    result.orderName = "MOCK";
    expect(result.orderName).toEqual("MOCK");
  });
  it("orderNumber should be editable", () => {
    let result = new SalesOrder();
    result.orderNumber = 2;
    expect(result.orderNumber).toEqual(2);
  });
  it("orderStatus should be editable", () => {
    let result = new SalesOrder();
    result.orderStatus = OrderStatus.CANCELED;
    expect(result.orderStatus).toEqual(OrderStatus.CANCELED);
  });
  it("lineItems should be editable", () => {
    let result = new SalesOrder();
    result.lineItems = [new SalesLineItem(mockLineItemProps())];
    const raw = result.lineItems.map((r) => r.raw());
    expect(raw).toEqual([mockLineItemProps()]);
  });
  it("customer should be editable", () => {
    let result = new SalesOrder();
    result.customer = new SalesCustomer({ email: "MOCK", name: "MOCK" });
    const raw = result.customer.raw();
    expect(raw).toEqual({ email: "MOCK", name: "MOCK" });
  });
  it("shippingAddress should be editable", () => {
    let result = new SalesOrder();
    result.shippingAddress = new Address(mockAddress);
    const raw = result.shippingAddress.raw();
    expect(raw).toEqual(mockAddress);
  });
  it("billingAddress should be editable", () => {
    let result = new SalesOrder();
    result.billingAddress = new Address(mockAddress);
    const raw = result.billingAddress.raw();
    expect(raw).toEqual(mockAddress);
  });
  it("updatedAt should be editable", () => {
    let result = new SalesOrder();
    const date = new Date("2022-06-04");
    result.updatedAt = date;
    const raw = result.updatedAt;
    expect(raw).toEqual(date);
  });
  it("createdAt should be editable", () => {
    let result = new SalesOrder();
    const date = new Date("2022-06-04");
    result.createdAt = date;
    const raw = result.createdAt;
    expect(raw).toEqual(date);
  });

  describe("PlaceOrder", () => {
    it("should update the order and add a SalesOrderPlacedEvent", () => {
      const dto: OrderPlacedDetails = cloneDeep(SalesOrderMocks.placedDetails);
      const order = new SalesOrder();
      order.create(dto);
      expect(order.orderStatus).toBe(OrderStatus.OPEN);
      expect(order.orderName).toBe(SalesOrderMocks.orderName);
      expect(order.orderNumber).toBe(SalesOrderMocks.orderNumber);
      expect(order.orderDate).toEqual(SalesOrderMocks.orderDate);
      expect(order.accountId).toBe(SalesOrderMocks.accountId);
      expect(order.customer.raw()).toEqual(SalesOrderMocks.customer);
      expect(order.lineItems).toContainEqual(
        new SalesLineItem(SalesOrderMocks.salesLineItem1)
      );
      expect(order.shippingAddress.raw()).toEqual(
        SalesOrderMocks.shippingAddress
      );
      expect(order.billingAddress.raw()).toEqual(
        SalesOrderMocks.billingAddress
      );
      const expectedEvent = SalesOrderMocks.orderPlacedEvent;
      expectedEvent.eventId = expect.anything();
      expectedEvent.timestamp = expect.anything();
      expect(order.events).toContainEqual(expectedEvent);
    });
  });
  describe("CancelOrder", () => {
    it("should update the order and add a SalesOrderCanceledEvent", () => {
      const dto: OrderPlacedDetails = cloneDeep(SalesOrderMocks.placedDetails);
      const order = new SalesOrder();
      order.id = SalesOrderMocks.id;
      const requester = { email: "sample@mail.com", name: "Sample Requester" };
      const cancelRequest = {
        canceledAt: now,
        requestedBy: requester,
      };
      order.cancel(cancelRequest);
      expect(order.orderStatus).toBe(OrderStatus.CANCELED);

      const expectedEvent = new SalesOrderCanceled(
        SalesOrderMocks.id,
        cancelRequest
      );
      expectedEvent.eventId = expect.anything();
      expectedEvent.timestamp = expect.anything();
      expect(order.events).toContainEqual(expectedEvent);
    });
  });
  describe("EditCustomer", () => {
    it("should update the order and add a CustomerInfoChangedEvent", () => {
      const order = new SalesOrder();
      order.id = SalesOrderMocks.id;
      const updatedCustomer = { name: "New Customer", email: "new@mail.com" };
      order.editCustomer(updatedCustomer);

      expect(order.customer.raw()).toEqual(updatedCustomer);

      const expectedEvent = new CustomerInfoChanged(
        SalesOrderMocks.id,
        updatedCustomer
      );
      expectedEvent.eventId = expect.anything();
      expectedEvent.timestamp = expect.anything();
      expect(order.events).toContainEqual(expectedEvent);
    });
  });
  describe("EditPersonalization", () => {
    it("should update the order and add a PersonalizationChangedEvent", () => {
      const order = SalesOrderMocks.order;
      order.id = SalesOrderMocks.id;
      const request = {
        lineNumber: 1,
        personalization: [
          { name: "Top Text", value: "Sample" },
          { name: "Bottom Text", value: "Updated" },
        ],
      };
      order.editPersonalization(request);

      const expectedEvent = new PersonalizationChanged(SalesOrderMocks.id, {
        ...request,
        orderId: SalesOrderMocks.id,
      });
      expectedEvent.eventId = expect.anything();
      expectedEvent.timestamp = expect.anything();
      expect(order.events).toContainEqual(expectedEvent);
    });
  });
  describe("EditShippingAddress", () => {
    it("should update the order and add a ShippingAddressChangedEvent", () => {
      const order = SalesOrderMocks.order;
      order.id = SalesOrderMocks.id;
      const request = {
        shippingAddress: {
          ...mockAddress,
          country: "United States",
          countryCode: "US",
          province: "Alabama",
          provinceCode: "AL",
          city: "Huntsville",
          zip: "35801",
        },
      };
      order.editShippingAddress(request);

      expect(order.shippingAddress.raw()).toEqual(request.shippingAddress);
      const expectedEvent = new ShippingAddressChanged(SalesOrderMocks.id, {
        shippingAddress: request.shippingAddress,
      });
      expectedEvent.eventId = expect.anything();
      expectedEvent.timestamp = expect.anything();
      expect(order.events).toContainEqual(expectedEvent);
    });
  });
});
function mockLineItemProps(): ISalesLineItemProps {
  return {
    lineNumber: 1,
    quantity: 1,
    personalization: [{ name: "Name", value: "Sample" }],
    variant: {
      id: mockUuid1,
      productId: mockUuid1,
      productTypeId: mockUuid1,
      sku: `MOCK_SKU`,
      type: ProductTypes.MetalArt,
      image: "MOCK_IMAGE",
      svg: "MOCK_SVG",
      height: {
        dimension: 12,
        units: "in",
      },
      manufacturingCost: {
        currency: "USD",
        total: 100,
      },
      option1: {
        name: "Size",
        value: '12"',
      },
      option2: {
        name: "Color",
        value: "Black",
      },
      option3: {
        name: "",
        value: "",
      },
      personalizationRules: [
        {
          name: "name",
          type: "input",
          label: "Name",
          options: "",
          pattern: "^[a-zA-Z0-9\\s.,'/&]*",
          required: true,
          maxLength: 16,
          placeholder: "Enter Up To 16 Characters",
        },
      ],
      productionData: {
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      },
      shippingCost: {
        currency: "USD",
        total: 1250,
      },
      weight: {
        dimension: 350,
        units: "g",
      },
      width: {
        dimension: 12,
        units: "in",
      },
    },
    flags: [],
  };
}
