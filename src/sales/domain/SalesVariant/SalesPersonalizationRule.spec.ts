import { ISalesPersonalizationRule, SalesPersonalizationRule } from ".";

describe("SalesPersonalizationRule", () => {
  describe("given", () => {
    describe("a valid SalesPersonalizationRule", () => {
      it("should return success", () => {
        const rule: ISalesPersonalizationRule = {
          name: "bottom_text",
          type: "input",
          label: "Bottom Text",
          options: "",
          pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
          required: true,
          maxLength: 16,
          placeholder: "Enter up to 16 characters",
        };
        const result = SalesPersonalizationRule.from(rule);
        expect(result.isFailure).toBe(false);
        const svo = result.value();
        const props = svo.value();
        const expected = {
          ...rule,
        };
        expect(props).toEqual(expected);
      });
    });
  });
});
