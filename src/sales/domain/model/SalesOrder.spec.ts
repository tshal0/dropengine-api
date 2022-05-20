import { ProductTypes } from "@catalog/domain";
import { mockAddress, mockUuid1 } from "@sales/mocks";
import { Address } from "@shared/domain";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { SalesCustomer } from "./SalesCustomer";
import { ISalesLineItemProps, SalesLineItem } from "./SalesLineItem";
import { ISalesOrderProps, OrderStatus, SalesOrder } from "./SalesOrder";

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
      shippingAddress: new Address({
        zip: "43844-9406",
        city: "Warsaw",
        name: "Tony Stark",
        phone: "2563472777",
        company: "MyEasySuite Inc.",
        country: "United States",
        address1: "19936 County Road 18",
        address2: "",
        address3: "",
        latitude: 40.2496938,
        province: "Ohio",
        lastName: "Stark",
        longitude: -82.1265222,
        firstName: "Tony",
        countryCode: "US",
        provinceCode: "OH",
      }).raw(),
      billingAddress: new Address().raw(),
      updatedAt: now,
      createdAt: now,
    };
    const result = new SalesOrder(props);
    expect(result.raw()).toEqual(props);
  });
  it("should not take invalid props", () => {
    const liProps = mockLineItemProps();

    let props: ISalesOrderProps = {
      id: '',
      accountId: '',
      orderName: "SLI-1001",
      orderNumber: 1001,
      orderDate: '' as any,
      orderStatus: OrderStatus.OPEN,
      lineItems: [liProps],
      customer: { email: "sample@mail.com", name: "Sample" },
      shippingAddress: new Address({
        zip: "43844-9406",
        city: "Warsaw",
        name: "Tony Stark",
        phone: "2563472777",
        company: "MyEasySuite Inc.",
        country: "United States",
        address1: "19936 County Road 18",
        address2: "",
        address3: "",
        latitude: 40.2496938,
        province: "Ohio",
        lastName: "Stark",
        longitude: -82.1265222,
        firstName: "Tony",
        countryCode: "US",
        provinceCode: "OH",
      }).raw(),
      billingAddress: new Address().raw(),
      updatedAt: now,
      createdAt: now,
    };
    let expected = cloneDeep(props)
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
