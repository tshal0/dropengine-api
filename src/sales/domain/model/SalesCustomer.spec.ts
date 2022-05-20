import { ISalesCustomer, SalesCustomer } from "./SalesCustomer";

describe("SalesCustomer", () => {
  let cust: SalesCustomer = null;

  beforeEach(() => {});
  it("should exist", () => {
    let cust = new SalesCustomer();
    const raw = cust.raw();
    const expected = {
      name: "",
      email: "",
    };
    expect(raw).toEqual(expected);
  });
  it("should take props", () => {
    let cust = new SalesCustomer({
      email: "sample@mail.com",
      name: "Customer Name",
    });
    const raw = cust.raw();
    const expected = {
      email: "sample@mail.com",
      name: "Customer Name",
    };
    expect(raw).toEqual(expected);
  });
  it("should have editable email", () => {
    let cust = new SalesCustomer({
      email: "sample@mail.com",
      name: "Customer Name",
    });
    cust.email = "sample@yahoo.com";

    expect(cust.email).toEqual("sample@yahoo.com");
  });
  it("should have editable name", () => {
    let cust = new SalesCustomer({
      email: "sample@mail.com",
      name: "Customer Name",
    });
    cust.name = "Customer Name 2";

    expect(cust.name).toEqual("Customer Name 2");
  });
});
