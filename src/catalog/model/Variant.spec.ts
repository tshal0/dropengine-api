import { mockUuid1 } from "@sales/mocks";
import {
  Dimension,
  Weight,
  Money,
  IDimension,
  IWeight,
  IMoney,
} from "@shared/domain";
import { IVariant, IVariantProps, Variant } from "./Variant";
import { VariantOption } from "./VariantOption";

describe("Variant", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Variant();
    const expected: IVariantProps = {
      id: null,
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
      type: "",
      productId: null,
      productTypeId: null,
    };
    expect(val.raw()).toMatchObject(expected);
    expect(val.id).toEqual(expected.id);
    expect(val.image).toEqual(expected.image);
    expect(val.sku).toEqual(expected.sku);
    expect(val.option1.raw()).toEqual(expected.option1);
    expect(val.option2.raw()).toEqual(expected.option2);
    expect(val.option3.raw()).toEqual(expected.option3);
    expect(val.height.raw()).toEqual(expected.height);
    expect(val.width.raw()).toEqual(expected.width);
    expect(val.weight.raw()).toEqual(expected.weight);
    expect(val.manufacturingCost.raw()).toEqual(expected.manufacturingCost);
    expect(val.shippingCost.raw()).toEqual(expected.shippingCost);
  });
  it("should take props", () => {
    const props: IVariantProps = {
      id: mockUuid1,
      image: "test",
      sku: "test",
      option1: {
        name: "Size",
        value: '18"',
      },
      option2: {
        name: "Color",
        value: "Black",
      },
      option3: new VariantOption().raw(),
      height: { dimension: 100, units: "mm" },
      width: { dimension: 100, units: "mm" },
      weight: { dimension: 100, units: "g" },
      manufacturingCost: { total: 100, currency: "USD" },
      shippingCost: { total: 100, currency: "USD" },
      type: "",
      productId: mockUuid1,
      productTypeId: mockUuid1,
    };
    const val = new Variant(props);

    expect(val.raw()).toMatchObject(props);
  });
  it("id does not change if given non-UUID", () => {
    const val = new Variant();
    val.id = "test";
    const expected = { id: null };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productId does not change if given non-UUID", () => {
    const val = new Variant();
    val.productId = "test";
    const expected = { productId: null };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productTypeId does not change if given non-UUID", () => {
    const val = new Variant();
    val.productTypeId = "test";
    const expected = { productTypeId: null };
    expect(val.raw()).toMatchObject(expected);
  });
  it("id does change if given UUID", () => {
    const val = new Variant();
    val.id = mockUuid1;
    const expected = { id: mockUuid1 };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productId does change if given UUID", () => {
    const val = new Variant();
    val.productId = mockUuid1;
    const expected = { productId: mockUuid1 };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productTypeId does change if given UUID", () => {
    const val = new Variant();
    val.productTypeId = mockUuid1;
    const expected = { productTypeId: mockUuid1 };
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
