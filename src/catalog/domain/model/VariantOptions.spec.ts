import {
  IVariantOptions,
  IVariantOptionsProps,
  VariantOptions,
} from "./VariantOptions";
import { VariantOptionValue } from "./VariantOptionValue";

describe("VariantOptions", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new VariantOptions();
    const expected: IVariantOptions = {
      name: "",
      enabled: false,
      values: [],
    };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props = {
      enabled: true,
      name: "Size",
      values: [{ enabled: true, value: '18"' }],
    };
    const val = new VariantOptions(props);
    const expected: IVariantOptionsProps = {
      enabled: true,
      name: "Size",
      values: [{ enabled: true, value: '18"' }],
    };
    expect(val.raw()).toEqual(expected);
  });
  it("enabled should be editable", () => {
    const val = new VariantOptions();
    val.enabled = true;
    const expected: IVariantOptions = {
      name: "",
      enabled: true,
      values: [],
    };
    expect(val.raw()).toEqual(expected);
  });
  it("name should be editable", () => {
    const val = new VariantOptions();
    val.name = tested;
    const expected: IVariantOptions = {
      name: tested,
      enabled: false,
      values: [],
    };
    expect(val.raw()).toEqual(expected);
  });
  it("values should be editable", () => {
    const val = new VariantOptions();
    const props = { enabled: true, value: "Black" };

    val.name = "Color";
    val.enabled = true;
    val.values = [new VariantOptionValue(props)];

    expect(val.raw()).toEqual({
      name: "Color",
      enabled: true,
      values: [props],
    });
  });
});
