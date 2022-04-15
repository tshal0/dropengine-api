import { Quantity } from ".";

describe("Quantity", () => {
  describe("given valid Quantity (1)", () => {
    it("should return success", () => {
      const result = Quantity.from(1);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given null", () => {
    it("should fail", () => {
      const result = Quantity.from(null);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "Quantity must be a valid integer.",
        name: "InvalidQuantity",
        message:
          "InvalidQuantity 'undefined': Quantity must be a valid integer.",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given 0", () => {
    it("should fail", () => {
      const result = Quantity.from(0);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "Quantity must be a valid integer.",
        name: "InvalidQuantity",
        message: "InvalidQuantity '0': Quantity must be a valid integer.",
        value: "0",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (1)", () => {
    it("should succeed", () => {
      const result = Quantity.from("1");
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given string (0)", () => {
    it("should fail", () => {
      const result = Quantity.from("0");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "Quantity must be a valid integer.",
        name: "InvalidQuantity",
        message: "InvalidQuantity '0': Quantity must be a valid integer.",
        value: "0",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (NOT_A_NUMBER)", () => {
    it("should fail", () => {
      const result = Quantity.from("NOT_A_NUMBER");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "Quantity must be a valid integer.",
        name: "InvalidQuantity",
        message: "InvalidQuantity 'NOT_A_NUMBER': Quantity must be a valid integer.",
        value: "NOT_A_NUMBER",
      };
      expect(err).toEqual(expected);
    });
  });
});
