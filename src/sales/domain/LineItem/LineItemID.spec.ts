import { Types } from "mongoose";
import { LineItemID } from ".";
describe("LineItemID", () => {
  describe("given valid ObjectId (00000000515bd494ed80cfbd)", () => {
    it("should succeed", () => {
      const oid = new Types.ObjectId("00000000515bd494ed80cfbd");
      const result = LineItemID.from(oid);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual("00000000515bd494ed80cfbd");
    });
  });
  describe("given valid string (00000000515bd494ed80cfbd)", () => {
    it("should succeed", () => {
      const oid = "00000000515bd494ed80cfbd";
      const result = LineItemID.from(oid);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual("00000000515bd494ed80cfbd");
    });
  });
  describe("given null", () => {
    it("should succeed", () => {
      const oid = null;
      const result = LineItemID.from(oid);
      expect(result.isFailure).toBe(false);
      const v = result.value();
      expect(v.value()).toEqual(null);
    });
  });
  describe("given invalid string (NOT_A_VALID_OBJECT_ID)", () => {
    it("should fail", () => {
      const oid = "NOT_A_VALID_OBJECT_ID";
      const result = LineItemID.from(oid);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        value: "NOT_A_VALID_OBJECT_ID",
        reason: "LineItemID must be a valid ObjectId.",
        name: "InvalidLineItemID",
        message:
          "InvalidLineItemID 'NOT_A_VALID_OBJECT_ID': LineItemID must be a valid ObjectId.",
      };
      expect(error).toEqual(expected);
    });
  });
});
