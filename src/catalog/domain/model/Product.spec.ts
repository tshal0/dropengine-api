import { mockUuid1 } from "@sales/mocks";
import { now } from "@shared/mocks";
import { PersonalizationRule } from "./PersonalizationRule";
import { IProductProps, Product } from "./Product";
import { IVariantProps, Variant } from "./Variant";
import { VariantOption } from "./VariantOption";

describe("Product", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Product();
    const expected: IProductProps = {
      id: null,
      image: "",
      sku: "",
      type: "",
      productTypeId: null,
      pricingTier: "",
      tags: [],
      svg: "",
      personalizationRules: [],
      variants: [],
      createdAt: now,
      updatedAt: now,
    };
    expect(val.raw()).toMatchObject(expected);
    expect(val.id).toEqual(expected.id);
    expect(val.image).toEqual(expected.image);
    expect(val.sku).toEqual(expected.sku);
    expect(val.type).toEqual(expected.type);
    expect(val.pricingTier).toEqual(expected.pricingTier);
    expect(val.tags).toEqual(expected.tags);
    expect(val.svg).toEqual(expected.svg);
    expect(val.personalizationRules).toEqual(expected.personalizationRules);
    expect(val.variants).toEqual(expected.variants);
    expect(val.createdAt).toEqual(expected.createdAt);
    expect(val.updatedAt).toEqual(expected.updatedAt);
  });
  it("should take props", () => {
    const props: IProductProps = {
      id: mockUuid1,
      productTypeId: mockUuid1,
      image: "test",
      sku: "test",
      type: "test",
      pricingTier: "test",
      tags: ["test"],
      svg: "test",
      personalizationRules: [
        {
          name: "test",
          type: "test",
          label: "test",
          options: "test",
          pattern: "test",
          required: false,
          maxLength: 0,
          placeholder: "test",
        },
      ],
      variants: [
        {
          id: mockUuid1,
          productId: mockUuid1,
          productTypeId: mockUuid1,
          type: "",
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
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    const val = new Product(props);

    expect(val.raw()).toMatchObject(props);
  });
  it("id fails to change if given non-UUID", () => {
    const val = new Product();
    val.id = "test";
    const expected = { id: null };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productTypeId fails to change if given non-UUID", () => {
    const val = new Product();
    val.productTypeId = "test";
    const expected = { productTypeId: null };
    expect(val.raw()).toMatchObject(expected);
  });
  it("id changes if given UUID", () => {
    const val = new Product();
    val.id = mockUuid1;
    const expected = { id: mockUuid1 };
    expect(val.raw()).toMatchObject(expected);
  });
  it("productTypeId changes if given UUID", () => {
    const val = new Product();
    val.productTypeId = mockUuid1;
    const expected = { productTypeId: mockUuid1 };
    expect(val.raw()).toMatchObject(expected);
  });
  it("sku is editable", () => {
    const val = new Product();
    val.sku = "test";
    const expected = { sku: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("type is editable", () => {
    const val = new Product();
    val.type = "test";
    const expected = { type: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("pricingTier is editable", () => {
    const val = new Product();
    val.pricingTier = "test";
    const expected = { pricingTier: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("tags is editable", () => {
    const val = new Product();
    val.tags = ["test"];
    const expected = { tags: ["test"] };
    expect(val.raw()).toMatchObject(expected);
  });
  it("image is editable", () => {
    const val = new Product();
    val.image = "test";
    const expected = { image: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("svg is editable", () => {
    const val = new Product();
    val.svg = "test";
    const expected = { svg: "test" };
    expect(val.raw()).toMatchObject(expected);
  });
  it("updatedAt is editable", () => {
    const val = new Product();
    val.updatedAt = now;
    const expected = { updatedAt: now };
    expect(val.raw()).toMatchObject(expected);
  });
  it("createdAt is editable", () => {
    const val = new Product();
    val.createdAt = now;
    const expected = { createdAt: now };
    expect(val.raw()).toMatchObject(expected);
  });
  it("personalizationRules is editable", () => {
    const val = new Product();
    const ruleProps = {
      name: "test",
      type: "test",
      label: "test",
      options: "test",
      pattern: "test",
      required: false,
      maxLength: 0,
      placeholder: "test",
    };
    val.personalizationRules = [new PersonalizationRule(ruleProps)];
    const expected = { personalizationRules: [ruleProps] };
    expect(val.raw()).toMatchObject(expected);
  });
  it("variants is editable", () => {
    const val = new Product();
    const variantProps: IVariantProps = {
      id: mockUuid1,
      type: "",
      productId: mockUuid1,
      productTypeId: mockUuid1,
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
    };
    val.variants = [new Variant(variantProps)];
    const expected = { variants: [variantProps] };
    expect(val.raw()).toMatchObject(expected);
  });
});
