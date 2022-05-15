import { IVariantOption, VariantOption } from "./VariantOption";

describe("VariantOption", () => {
  const tested = "test";
  it("should initialize to default", () => {
    const val = new VariantOption();
    const expected: IVariantOption = {
      name: "",
      value: "",
      enabled: false,
    };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const expected: IVariantOption = {
      name: "test",
      value: "test",
      enabled: true,
    };
    const val = new VariantOption(expected);

    expect(val.raw()).toEqual(expected);
  });
  it("enabled should be editable", () => {
    const val = new VariantOption();
    val.enabled = true;
    const expected: IVariantOption = {
      name: "",
      value: "",
      enabled: true,
    };
    expect(val.raw()).toEqual(expected);
  });
  it("name should be editable", () => {
    const val = new VariantOption();
    val.name = tested;
    const expected: IVariantOption = {
      name: tested,
      value: "",
      enabled: false,
    };
    expect(val.raw()).toEqual(expected);
  });
  it("value should be editable", () => {
    const val = new VariantOption();
    val.value = tested;
    const expected: IVariantOption = {
      name: "",
      value: tested,
      enabled: false,
    };
    expect(val.raw()).toEqual(expected);
  });
});
