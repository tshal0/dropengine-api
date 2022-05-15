import { ISalesVariantOption, SalesVariantOption } from "./SalesVariantOption";

describe("SalesVariantOption", () => {
  describe("given", () => {
    describe("a valid SalesVariantOption", () => {
      it("should return success with a valid SalesVariantOption", () => {
        const opt: ISalesVariantOption = {
          name: "Size",
          value: '18"',
          enabled: true,
        };
        const result = SalesVariantOption.from(opt);
        expect(result.isFailure).toBe(false);
        const svo = result.value();
        const props = svo.value();
        const expected = {
          name: "Size",
          option: '18"',
          enabled: true,
        };
        expect(props).toEqual(expected);
      });
    });

    describe("a valid disabled SalesVariantOption ", () => {
      it("should return success", () => {
        const opt: ISalesVariantOption = {
          enabled: false,
          name: undefined,
          value: null,
        };
        const result = SalesVariantOption.from(opt);
        expect(result.isFailure).toBe(false);
        const val = result.value().value();
        const expected = {
          enabled: false,
          name: undefined,
          option: null,
        };
        expect(val).toEqual(expected);
      });
    });
    describe("a SalesVariantOption without a name", () => {
      it("should return failure", () => {
        const opt: ISalesVariantOption = {
          enabled: true,
          name: undefined,
          value: '18"',
        };
        const result = SalesVariantOption.from(opt);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          reason:
            "SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.",
          name: "InvalidSalesVariantOption",
          message:
            'InvalidSalesVariantOption \'{"enabled":true,"option":"18\\""}\': SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.',
          value: '{"enabled":true,"option":"18\\""}',
        };
        expect(error).toEqual(expected);
      });
    });
    describe("a SalesVariantOption without an option", () => {
      it("should return failure", () => {
        const opt: ISalesVariantOption = {
          enabled: true,
          name: "Size",
          value: undefined,
        };
        const result = SalesVariantOption.from(opt);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          reason:
            "SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.",
          name: "InvalidSalesVariantOption",
          message:
            'InvalidSalesVariantOption \'{"enabled":true,"name":"Size"}\': SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.',
          value: '{"enabled":true,"name":"Size"}',
        };
        expect(error).toEqual(expected);
      });
    });
    describe("a SalesVariantOption without an enabled status", () => {
      it("should return failure", () => {
        const opt: ISalesVariantOption = {
          enabled: undefined,
          name: "Size",
          value: '18"',
        };
        const result = SalesVariantOption.from(opt);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          reason:
            "SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.",
          name: "InvalidSalesVariantOption",
          message:
            'InvalidSalesVariantOption \'{"name":"Size","option":"18\\""}\': SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.',
          value: '{"name":"Size","option":"18\\""}',
        };
        expect(error).toEqual(expected);
      });
    });
  });
});
