import { IVariantOptionValue, VariantOptionValue } from "./VariantOptionValue";

describe("VariantOptionValue", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new VariantOptionValue();
    const expected: IVariantOptionValue = {
      value: "",
      enabled: false,
    };
    expect(val.raw()).toEqual(expected);
    expect(val.value).toEqual("");
    expect(val.enabled).toEqual(false);
  });
  it("enabled is editable", () => {
    const val = new VariantOptionValue();
    val.enabled = true;
    const expected: IVariantOptionValue = {
      value: "",
      enabled: true,
    };
    expect(val.raw()).toEqual(expected);
  });
  it("value is editable", () => {
    const val = new VariantOptionValue();
    val.value = tested;
    const expected: IVariantOptionValue = {
      value: tested,
      enabled: false,
    };
    expect(val.raw()).toEqual(expected);
  });
});
