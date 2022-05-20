import { ProductTypes } from "@catalog/domain";
import { mockUuid1, mockUuid2 } from "@sales/mocks";
import { cloneDeep } from "lodash";
import { Personalization } from "./Personalization";
import { ISalesLineItemProps, SalesLineItem } from "./SalesLineItem";
import { SalesVariant } from "./SalesVariant";

describe("SalesLineItem", () => {
  let props: ISalesLineItemProps = null;
  beforeEach(() => {
    props = {
      lineNumber: 0,
      quantity: 0,
      variant: {
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
        productionData: {
          material: "Mild Steel",
          route: "1",
          thickness: "0.06",
        },
        personalizationRules: [],
        productId: null,
        productTypeId: null,
        height: { dimension: 0, units: "mm" },
        width: { dimension: 0, units: "mm" },
      },
      personalization: [],
      flags: [],
    };
  });
  it("should exist", () => {
    const li = new SalesLineItem();
    expect(li.raw()).toEqual({
      lineNumber: 0,
      quantity: 0,
      flags: [],
      personalization: [],
      variant: {
        id: null,
        productId: null,
        productTypeId: null,
        image: "",
        sku: "",
        svg: "",
        type: "",
        height: {
          dimension: 0,
          units: "mm",
        },
        manufacturingCost: {
          currency: "USD",
          total: 0,
        },
        option1: {
          name: "",
          value: "",
        },
        option2: {
          name: "",
          value: "",
        },
        option3: {
          name: "",
          value: "",
        },
        personalizationRules: [],
        productionData: {
          material: "Mild Steel",
          route: "1",
          thickness: "0.06",
        },
        shippingCost: {
          currency: "USD",
          total: 0,
        },
        weight: {
          dimension: 0,
          units: "g",
        },
        width: {
          dimension: 0,
          units: "mm",
        },
      },
    });
  });
  it("should take props", () => {
    const props: ISalesLineItemProps = mockProps();
    const li = new SalesLineItem(cloneDeep(props));

    expect(li.raw()).toEqual(props);
  });
  it("should have editable lineNumber", () => {
    const props: ISalesLineItemProps = mockProps();
    const li = new SalesLineItem(cloneDeep(props));
    li.lineNumber = 2;
    expect(li.lineNumber).toEqual(2);
  });
  it("should have editable quantity", () => {
    const props: ISalesLineItemProps = mockProps();
    const li = new SalesLineItem(cloneDeep(props));
    li.quantity = 2;
    expect(li.quantity).toEqual(2);
  });
  it("should have editable variant", () => {
    const props: ISalesLineItemProps = mockProps();
    const variant = cloneDeep(props.variant);
    variant.id = mockUuid2;
    const li = new SalesLineItem(cloneDeep(props));
    li.variant = variant;
    expect(li.variant.id).toEqual(mockUuid2);
  });
  it("should have editable personalization", () => {
    const props: ISalesLineItemProps = mockProps();
    let personalization: Personalization[] = cloneDeep(
      props.personalization
    ).map((p) => new Personalization(p));
    personalization = [new Personalization({ name: "Name", value: "NewVal" })];
    const li = new SalesLineItem(cloneDeep(props));
    li.personalization = personalization;
    let pers = li.personalization.map((r) => r.raw());
    expect(pers).toEqual([{ name: "Name", value: "NewVal" }]);
  });
});
function mockProps(): ISalesLineItemProps {
  return {
    lineNumber: 1,
    quantity: 1,
    personalization: [{ name: "Name", value: "Sample" }],
    variant: {
      id: mockUuid1,
      productId: mockUuid1,
      productTypeId: mockUuid1,
      sku: `MOCK_SKU`,
      type: ProductTypes.MetalArt,
      image: "MOCK_IMAGE",
      svg: "MOCK_SVG",
      height: {
        dimension: 12,
        units: "in",
      },
      manufacturingCost: {
        currency: "USD",
        total: 100,
      },
      option1: {
        name: "Size",
        value: '12"',
      },
      option2: {
        name: "Color",
        value: "Black",
      },
      option3: {
        name: "",
        value: "",
      },
      personalizationRules: [
        {
          name: "name",
          type: "input",
          label: "Name",
          options: "",
          pattern: "^[a-zA-Z0-9\\s.,'/&]*",
          required: true,
          maxLength: 16,
          placeholder: "Enter Up To 16 Characters",
        },
      ],
      productionData: {
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      },
      shippingCost: {
        currency: "USD",
        total: 1250,
      },
      weight: {
        dimension: 350,
        units: "g",
      },
      width: {
        dimension: 12,
        units: "in",
      },
    },
    flags: [],
  };
}
