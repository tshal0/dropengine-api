import { mockUuid1 } from "@sales/mocks";
import { now } from "@shared/mocks";
import { IProductTypeProps, ProductType } from "./ProductType";
import { VariantOption } from "./VariantOption";

describe("ProductType", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new ProductType();
    const expected: IProductTypeProps = {
      id: null,
      name: "",
      slug: "",
      image: "",
      productionData: {
        route: "1",
        material: "Mild Steel",
        thickness: "0.06",
      },
      option1: {
        enabled: false,
        name: "",
        values: [],
      },
      option2: {
        enabled: false,
        name: "",
        values: [],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      livePreview: {
        enabled: false,
        link: "",
        name: "",
        version: "",
      },
      products: [],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    };
    expect(val.raw()).toEqual(expected);
    expect(val.id).toEqual(expected.id);
    expect(val.name).toEqual(expected.name);
    expect(val.image).toEqual(expected.image);
    expect(val.productionData.raw()).toEqual(expected.productionData);
    expect(val.option1.raw()).toEqual(expected.option1);
    expect(val.option2.raw()).toEqual(expected.option2);
    expect(val.option3.raw()).toEqual(expected.option3);
    expect(val.livePreview.raw()).toEqual(expected.livePreview);
    expect(val.products.map((p) => p.raw())).toEqual(expected.products);
    expect(val.updatedAt).toEqual(expected.updatedAt);
    expect(val.createdAt).toEqual(expected.createdAt);
  });
  it("should take props", () => {
    const props: IProductTypeProps = {
      id: 1,
      name: "test",
      slug: "test",
      image: "test",
      productionData: {
        route: "2",
        material: "Galv Steel",
        thickness: "0.12",
      },
      option1: {
        enabled: true,
        name: "Size",
        values: [{ enabled: true, value: '18"' }],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [{ enabled: true, value: "Black" }],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      livePreview: {
        enabled: false,
        link: "",
        name: "",
        version: "",
      },
      products: [
        {
          id: 1,
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
              id: 1,
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
        },
      ],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    };
    const val = new ProductType(props);
    const expected: IProductTypeProps = {
      id: 1,
      name: "test",
      slug: "test",
      image: "test",
      productionData: {
        route: "2",
        material: "Galv Steel",
        thickness: "0.12",
      },
      option1: {
        enabled: true,
        name: "Size",
        values: [{ enabled: true, value: '18"' }],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [{ enabled: true, value: "Black" }],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      livePreview: {
        enabled: false,
        link: "",
        name: "",
        version: "",
      },
      products: [
        {
          id: 1,
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
              id: 1,
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
        },
      ],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    };
    expect(val.raw()).toMatchObject(expected);
  });
});
