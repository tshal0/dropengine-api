import { CatalogVariant } from "@catalog/services";
import { ICustomOptionProps } from "@catalog/domain";

export function mockCatalogVariant(): CatalogVariant {
  const customOptionTop: ICustomOptionProps = {
    maxLength: 12,
    pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
    type: "input",
    required: true,
    label: "Top Text",
    placeholder: "Enter up to 12 characters",
    name: "top_text",
  };
  const customOptionBottom: ICustomOptionProps = {
    maxLength: 12,
    pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
    type: "input",
    required: true,
    label: "Bottom Text",
    placeholder: "Enter up to 12 characters",
    name: "bottom_text",
  };
  return {
    id: "MOCK_ID",
    sku: "MOCK_SKU",
    image: "MOCK_IMAGE",
    svg: "MOCK_SVG",
    type: "MOCK_TYPE",
    option1: { enabled: true, name: "Size", option: "12" },
    option2: { enabled: true, name: "Color", option: "Black" },
    option3: null,
    productionData: null,
    personalizationRules: [customOptionTop, customOptionBottom],
    manufacturingCost: { total: 11, currency: "USD" },
    shippingCost: { total: 11, currency: "USD" },
    weight: { dimension: 120, units: "oz" },
  };
}
