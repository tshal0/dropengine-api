import {
  PersonalizationRule,
  ProductionData,
  VariantOption,
} from "@catalog/model";
import { mockUuid1 } from "@sales/mocks";
import { Dimension, Money, Weight } from "@shared/domain";
import { cloneDeep } from "lodash";
import mongoose from "mongoose";
import { Personalization } from "./Personalization";
import { ISalesVariantProps, SalesVariant } from "./SalesVariant";

describe("SalesVariant", () => {
  let variant: SalesVariant = null;
  let props: ISalesVariantProps = null;
  beforeEach(() => {
    props = {
      id: null,
      sku: "",
      image: "",
      svg: "",
      type: "",
      option1: { name: "", value: "" },
      option2: { name: "", value: "" },
      option3: { name: "", value: "" },
      manufacturingCost: { currency: "USD", total: 0 },
      shippingCost: { currency: "USD", total: 0 },
      weight: { units: "g", dimension: 0 },
      productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
      personalizationRules: [],
      height: { dimension: 0, units: "mm" },
      width: { dimension: 0, units: "mm" },
    };
  });
  it("should exist", () => {
    variant = new SalesVariant();

    const raw = variant.raw();
    expect(raw).toEqual(props);
  });
  it("should take props", () => {
    variant = new SalesVariant(cloneDeep(props));
    const raw = variant.raw();
    expect(raw).toEqual(props);
  });
  it("id should change for valid ObjectId", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.id = 1;

    expect(variant.id).toEqual(1);
  });
  it("id should NOT change for non-ObjectId", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.id = `` as unknown as number;

    expect(variant.id).toEqual(null);
  });

  it("image should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.image = "test";

    expect(variant.image).toEqual("test");
  });
  it("sku should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.sku = "test";

    expect(variant.sku).toEqual("test");
  });
  it("svg should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.svg = "test";

    expect(variant.svg).toEqual("test");
  });
  it("type should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.type = "test";

    expect(variant.type).toEqual("test");
  });
  it("option1 should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.option1 = new VariantOption({ name: "Size", value: '22"' });

    expect(variant.option1.raw()).toEqual({ name: "Size", value: '22"' });
  });
  it("option2 should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.option2 = new VariantOption({ name: "Size", value: '22"' });

    expect(variant.option2.raw()).toEqual({ name: "Size", value: '22"' });
  });
  it("option3 should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.option3 = new VariantOption({ name: "Size", value: '22"' });

    expect(variant.option3.raw()).toEqual({ name: "Size", value: '22"' });
  });
  it("productionData should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.productionData = new ProductionData({
      material: "Birch",
      route: "5",
      thickness: "0.25",
    });

    expect(variant.productionData.raw()).toEqual({
      material: "Birch",
      route: "5",
      thickness: "0.25",
    });
  });
  it("personalizationRules should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    const rule = new PersonalizationRule({
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.,'/&]*",
      required: false,
      maxLength: 0,
      placeholder: "",
    });
    variant.personalizationRules = [rule];

    expect(variant.personalizationRules.map((r) => r.raw())).toEqual([
      {
        name: "",
        type: "",
        label: "",
        options: "",
        pattern: "^[a-zA-Z0-9\\s.,'/&]*",
        required: false,
        maxLength: 0,
        placeholder: "",
      },
    ]);
  });
  it("manufacturingCost should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.manufacturingCost = new Money({ currency: "USD", total: 100 });

    expect(variant.manufacturingCost.raw()).toEqual({
      currency: "USD",
      total: 100,
    });
  });
  it("shippingCost should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.shippingCost = new Money({ currency: "USD", total: 100 });

    expect(variant.shippingCost.raw()).toEqual({ currency: "USD", total: 100 });
  });
  it("weight should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.weight = new Weight({ dimension: 100, units: "oz" });

    expect(variant.weight.raw()).toEqual({ dimension: 100, units: "oz" });
  });
  it("height should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.height = new Dimension({ units: "in", dimension: 100 });

    expect(variant.height.raw()).toEqual({ units: "in", dimension: 100 });
  });
  it("width should be editable", () => {
    const expected = cloneDeep(props);
    variant = new SalesVariant(expected);
    variant.width = new Dimension({ units: "in", dimension: 100 });

    expect(variant.width.raw()).toEqual({ units: "in", dimension: 100 });
  });
});
