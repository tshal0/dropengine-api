import { CatalogVariant } from "@catalog/services";
import { CreateOrderLineItemApiDto } from "@sales/api";
import { CustomerDto } from "@sales/dto";
import { AddressDto } from "../../../dto/AddressDto";
export const mockUuid1 = "00000000-0000-0000-0000-000000000001";
export const mockUuid2 = "00000000-0000-0000-0000-000000000002";
export const mockUuid3 = "00000000-0000-0000-0000-000000000003";
export const mockProductSku = "MU-C004-00";
export const mockSku1 = `${mockProductSku}-18-Black`;
export const mockSku2 = `${mockProductSku}-24-Black`;

export const mockTopText = "Top Text";
export const mockMiddleText = "Middle Text";
export const mockBottomText = "Bottom Text";
export const mockInitial = "Initial";
export const mockCatalogVariant1: CatalogVariant = {
  id: mockUuid1,
  sku: mockSku1,
  image: "mock_image",
  svg: "mock_svg",
  type: "2DMetalArt",
  option1: { name: "Size", option: '18"', enabled: true },
  option2: { name: "Color", option: "Black", enabled: true },
  option3: { name: undefined, option: null, enabled: false },
  productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
  personalizationRules: [
    {
      name: "top_text",
      type: "input",
      label: mockTopText,
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 16,
      placeholder: "Enter up to 16 characters",
    },
    {
      name: "middle_text",
      type: "input",
      label: mockMiddleText,
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 14,
      placeholder: "Enter up to 14 characters",
    },
    {
      name: "bottom_text",
      type: "input",
      label: mockBottomText,
      options: "",
      pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
      required: true,
      maxLength: 16,
      placeholder: "Enter up to 16 characters",
    },
    {
      name: "initial",
      type: "dropdownlist",
      label: mockInitial,
      options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
      required: true,
      maxLength: null,
      placeholder: "Select Initial",
    },
  ],
  weight: {
    units: "oz",
    dimension: 738,
  },
  manufacturingCost: {
    total: 650,
    currency: "USD",
  },
  shippingCost: {
    total: 1200,
    currency: "USD",
  },
};
export const mockCatalogVariant2: CatalogVariant = {
  id: mockUuid2,
  sku: mockSku2,
  image: "mock_image",
  svg: "mock_svg",
  type: "2DMetalArt",
  option1: { name: "Size", option: '24"', enabled: true },
  option2: { name: "Color", option: "Black", enabled: true },
  option3: { name: undefined, option: null, enabled: false },
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
export const mockLineItem: CreateOrderLineItemApiDto = {
  sku: mockSku1,
  quantity: 1,
  lineItemProperties: [{ name: "Name", value: "MockName" }],
};
export const mockAddress: AddressDto = {
  zip: "43844-9406",
  city: "Warsaw",
  name: "Tony Stark",
  phone: "2563472777",
  company: "MyEasySuite Inc.",
  country: "United States",
  address1: "19936 County Road 18",
  address2: "",
  address3: "",
  latitude: 40.2496938,
  province: "Ohio",
  lastName: "Stark",
  longitude: -82.1265222,
  firstName: "Tony",
  countryCode: "US",
  provinceCode: "OH",
};
export const mockCustomer: CustomerDto = {
  email: "mock.customer@email.com",
  name: "Mock Customer",
};
