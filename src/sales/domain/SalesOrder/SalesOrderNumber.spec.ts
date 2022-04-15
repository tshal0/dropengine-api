import { SalesOrderNumber } from "./SalesOrderNumber";

describe("SalesOrderNumber", () => {
  describe("given valid SalesOrderNumber (1)", () => {
    it("should return success", () => {
      const result = SalesOrderNumber.from(1);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given null", () => {
    it("should fail", () => {
      const result = SalesOrderNumber.from(null);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "SalesOrderNumber must be a valid integer.",
        name: "InvalidSalesOrderNumber",
        message:
          "InvalidSalesOrderNumber 'null': SalesOrderNumber must be a valid integer.",
        value: null,
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given 0", () => {
    it("should fail", () => {
      const result = SalesOrderNumber.from(0);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "SalesOrderNumber must be a valid integer.",
        name: "InvalidSalesOrderNumber",
        message:
          "InvalidSalesOrderNumber '0': SalesOrderNumber must be a valid integer.",
        value: 0,
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (1)", () => {
    it("should succeed", () => {
      const result = SalesOrderNumber.from("1");
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given string (0)", () => {
    it("should fail", () => {
      const result = SalesOrderNumber.from("0");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "SalesOrderNumber must be a valid integer.",
        name: "InvalidSalesOrderNumber",
        message:
          "InvalidSalesOrderNumber '0': SalesOrderNumber must be a valid integer.",
        value: "0",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (NOT_A_NUMBER)", () => {
    it("should fail", () => {
      const result = SalesOrderNumber.from("NOT_A_NUMBER");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "SalesOrderNumber must be a valid integer.",
        name: "InvalidSalesOrderNumber",
        message:
          "InvalidSalesOrderNumber 'NOT_A_NUMBER': SalesOrderNumber must be a valid integer.",
        value: "NOT_A_NUMBER",
      };
      expect(err).toEqual(expected);
    });
  });
});
