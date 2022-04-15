import { LineNumber } from "./LineNumber";

describe("LineNumber", () => {
  describe("given valid LineNumber (1)", () => {
    it("should return success", () => {
      const result = LineNumber.from(1);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given null", () => {
    it("should fail", () => {
      const result = LineNumber.from(null);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "LineNumber must be a valid integer.",
        name: "InvalidLineNumber",
        message:
          "InvalidLineNumber 'undefined': LineNumber must be a valid integer.",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given 0", () => {
    it("should fail", () => {
      const result = LineNumber.from(0);
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "LineNumber must be a valid integer.",
        name: "InvalidLineNumber",
        message: "InvalidLineNumber '0': LineNumber must be a valid integer.",
        value: "0",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (1)", () => {
    it("should succeed", () => {
      const result = LineNumber.from("1");
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(1);
    });
  });
  describe("given string (0)", () => {
    it("should fail", () => {
      const result = LineNumber.from("0");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "LineNumber must be a valid integer.",
        name: "InvalidLineNumber",
        message: "InvalidLineNumber '0': LineNumber must be a valid integer.",
        value: "0",
      };
      expect(err).toEqual(expected);
    });
  });
  describe("given string (NOT_A_NUMBER)", () => {
    it("should fail", () => {
      const result = LineNumber.from("NOT_A_NUMBER");
      expect(result.isFailure).toBe(true);
      const err = result.error;
      const expected = {
        reason: "LineNumber must be a valid integer.",
        name: "InvalidLineNumber",
        message: "InvalidLineNumber 'NOT_A_NUMBER': LineNumber must be a valid integer.",
        value: "NOT_A_NUMBER",
      };
      expect(err).toEqual(expected);
    });
  });
});
