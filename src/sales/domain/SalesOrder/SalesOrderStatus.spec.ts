import { OrderStatus, SalesOrderStatus } from ".";

describe("SalesOrderStatus", () => {
  describe("given valid OrderStatus (OPEN)", () => {
    it("should return SalesOrderStatus (OPEN)", () => {
      const mockStatus = OrderStatus.OPEN;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockStatus);
    });
  });
  describe("given valid OrderStatus (CANCELED)", () => {
    it("should return SalesOrderStatus (CANCELED)", () => {
      const mockStatus = OrderStatus.CANCELED;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockStatus);
    });
  });
  describe("given valid OrderStatus (COMPLETE)", () => {
    it("should return SalesOrderStatus (COMPLETE)", () => {
      const mockStatus = OrderStatus.COMPLETE;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockStatus);
    });
  });
  describe("given valid OrderStatus (FULFILLED)", () => {
    it("should return SalesOrderStatus (FULFILLED)", () => {
      const mockStatus = OrderStatus.FULFILLED;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockStatus);
    });
  });
  describe("given valid OrderStatus (ARCHIVED)", () => {
    it("should return SalesOrderStatus (ARCHIVED)", () => {
      const mockStatus = OrderStatus.ARCHIVED;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mockStatus);
    });
  });
  describe("given invalid string (NOT_AN_ORDER_STATUS)", () => {
    it("should fail", () => {
      const mockStatus = "NOT_AN_ORDER_STATUS";
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        value: "NOT_AN_ORDER_STATUS",
        reason:
          "SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
        name: "InvalidSalesOrderStatus",
        message:
          "InvalidSalesOrderStatus 'NOT_AN_ORDER_STATUS': SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
      };
      expect(error).toEqual(expected);
    });
  });
  describe("given invalid number (0)", () => {
    it("should fail", () => {
      const mockStatus = 0;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        value: "0",
        reason:
          "SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
        name: "InvalidSalesOrderStatus",
        message:
          "InvalidSalesOrderStatus '0': SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
      };
      expect(error).toEqual(expected);
    });
  });
  describe("given null", () => {
    it("should fail", () => {
      const mockStatus = null;
      let result = SalesOrderStatus.from(mockStatus);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        value: "null",
        reason:
          "SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
        name: "InvalidSalesOrderStatus",
        message:
          "InvalidSalesOrderStatus 'null': SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).",
      };
      expect(error).toEqual(expected);
    });
  });
});
