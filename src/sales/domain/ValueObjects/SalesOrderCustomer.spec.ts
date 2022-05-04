import { SalesOrderCustomer } from "./SalesOrderCustomer";

describe("SalesOrderCustomer", () => {
  describe("given valid Customer", () => {
    it("should return SalesOrderCustomer", async () => {
      const mockCustomer = { name: "Name", email: "email@example.com" };
      let result = await SalesOrderCustomer.from(mockCustomer);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockCustomer);
    });
  });
  describe("given Customer with no name", () => {
    it("should fail", async () => {
      const mockCustomer = { name: null, email: "email@example.com" };
      let result = await SalesOrderCustomer.from(mockCustomer);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        inner: [
          {
            value: {
              target: {
                email: "email@example.com",
                name: null,
              },
              value: null,
              property: "name",
              children: [],
              constraints: {
                isNotEmpty: "name should not be empty",
                isString: "name must be a string",
              },
            },
            reason: "'name' is invalid.",
            name: "CustomerValidationError",
            message:
              "CustomerValidationError 'An instance of CustomerDto has failed the validation:\n - property name has failed the following constraints: isNotEmpty, isString \n': 'name' is invalid.",
          },
        ],
        value: {
          name: null,
          email: "email@example.com",
        },
        reason: "SalesOrderCustomer must be a valid Customer.",
        name: "InvalidSalesOrderCustomer",
        message:
          "InvalidSalesOrderCustomer 'email@example.com': SalesOrderCustomer must be a valid Customer.",
      };
      expect(error).toEqual(expected);
    });
  });
  describe("given Customer with no email", () => {
    it("should fail", async () => {
      const mockCustomer = { name: "Name", email: null };
      let result = await SalesOrderCustomer.from(mockCustomer);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        inner: [
          {
            value: {
              target: {
                email: null,
                name: "Name",
              },
              value: null,
              property: "email",
              children: [],
              constraints: {
                isNotEmpty: "email should not be empty",
                isString: "email must be a string",
              },
            },
            reason: "'email' is invalid.",
            name: "CustomerValidationError",
            message:
              "CustomerValidationError 'An instance of CustomerDto has failed the validation:\n - property email has failed the following constraints: isNotEmpty, isString \n': 'email' is invalid.",
          },
        ],
        value: {
          name: "Name",
          email: null,
        },
        reason: "SalesOrderCustomer must be a valid Customer.",
        name: "InvalidSalesOrderCustomer",
        message:
          "InvalidSalesOrderCustomer 'Name': SalesOrderCustomer must be a valid Customer.",
      };
      expect(error).toEqual(expected);
    });
  });
  describe("given null", () => {
    it("should fail", async () => {
      const mockCustomer = null;
      let result = await SalesOrderCustomer.from(mockCustomer);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        inner: [],
        value: null,
        reason:
          "SalesOrderCustomer must be a valid Customer, with a name and email.",
        name: "InvalidSalesOrderCustomer",
        message:
          "InvalidSalesOrderCustomer 'undefined': SalesOrderCustomer must be a valid Customer, with a name and email.",
      };
      expect(error).toEqual(expected);
    });
  });
});
