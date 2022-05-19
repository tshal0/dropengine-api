import { CatalogVariant } from "@catalog/services";
import { mockUuid2, mockSku2 } from "./mocks";

export const mockCatalogVariant2: CatalogVariant = {
  id: mockUuid2,
  sku: mockSku2,
  image: "mock_image",
  svg: "mock_svg",
  type: "2DMetalArt",
  option1: { name: "Size", value: '24"' },
  option2: { name: "Color", value: "Black" },
  option3: { name: undefined, value: null },
  productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
  personalizationRules: [
    {
      name: "top_text",
      type: "input",
      label: "Top Text",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 16,
      placeholder: "Enter up to 16 characters",
    },
    {
      name: "middle_text",
      type: "input",
      label: "Middle Text",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 14,
      placeholder: "Enter up to 14 characters",
    },
    {
      name: "bottom_text",
      type: "input",
      label: "Bottom Text",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 16,
      placeholder: "Enter up to 16 characters",
    },
    {
      name: "initial",
      type: "dropdownlist",
      label: "Initial",
      options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
      required: true,
      maxLength: null,
      placeholder: "Select Initial",
      pattern: null,
    },
  ],
  weight: {
    units: "oz",
    dimension: 1443,
  },
  manufacturingCost: {
    total: 900,
    currency: "USD",
  },
  shippingCost: {
    total: 1300,
    currency: "USD",
  },
};
