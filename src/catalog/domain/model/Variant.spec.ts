import { Dimension, IDimension } from "./Dimension";
import { IMoney, Money } from "./Money";
import { IVariant, IVariantProps, Variant } from "./Variant";
import { VariantOption } from "./VariantOption";
import { IWeight, Weight } from "./Weight";

describe("Variant", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Variant();
    const expected: IVariantProps = {
      id: "",
      image: "",
      sku: "",
      option1: new VariantOption().raw(),
      option2: new VariantOption().raw(),
      option3: new VariantOption().raw(),
      height: new Dimension().raw(),
      width: new Dimension().raw(),
      weight: new Weight().raw(),
      manufacturingCost: new Money().raw(),
      shippingCost: new Money().raw(),
    };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props: IVariantProps = {
      id: "test",
      image: "test",
      sku: "test",
      option1: {
        enabled: true,
        name: "Size",
        value: '18"',
      },
      option2: {
        enabled: true,
        name: "Color",
        value: "Black",
      },
      option3: new VariantOption().raw(),
      height: { dimension: 100, units: "mm" },
      width: { dimension: 100, units: "mm" },
      weight: { dimension: 100, units: "g" },
      manufacturingCost: { total: 100, currency: "USD" },
      shippingCost: { total: 100, currency: "USD" },
    };
    const val = new Variant(props);

    expect(val.raw()).toEqual(props);
  });
  it("id is editable", () => {
    const val = new Variant();
    val.id = "test";
    const expected = { id: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("sku is editable", () => {
    const val = new Variant();
    val.sku = "test";
    const expected = { sku: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("image is editable", () => {
    const val = new Variant();
    val.image = "test";
    const expected = { image: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("option1 is editable", () => {
    const val = new Variant();
    const props = {
      enabled: true,
      name: "test",
      value: "test",
    };
    val.option1 = new VariantOption(props);
    const expected = { option1: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("option2 is editable", () => {
    const val = new Variant();
    const props = {
      enabled: true,
      name: "test",
      value: "test",
    };
    val.option2 = new VariantOption(props);
    const expected = { option2: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("option3 is editable", () => {
    const val = new Variant();
    const props = {
      enabled: true,
      name: "test",
      value: "test",
    };
    val.option3 = new VariantOption(props);
    const expected = { option3: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("height is editable", () => {
    const val = new Variant();
    const props: IDimension = { units: "mm", dimension: 100 };
    val.height = new Dimension(props);
    const expected = { height: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("width is editable", () => {
    const val = new Variant();
    const props: IDimension = { units: "mm", dimension: 100 };
    val.width = new Dimension(props);
    const expected = { width: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("weight is editable", () => {
    const val = new Variant();
    const props: IWeight = { units: "g", dimension: 100 };
    val.weight = new Weight(props);
    const expected = { weight: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("manufacturingCost is editable", () => {
    const val = new Variant();
    const props: IMoney = { currency: "USD", total: 100 };
    val.manufacturingCost = new Money(props);
    const expected = { manufacturingCost: props };
    expect(val.raw()).toMatchObject(expected);
  });
  it("shippingCost is editable", () => {
    const val = new Variant();
    const props: IMoney = { currency: "USD", total: 100 };
    val.shippingCost = new Money(props);
    const expected = { shippingCost: props };
    expect(val.raw()).toMatchObject(expected);
  });
});
