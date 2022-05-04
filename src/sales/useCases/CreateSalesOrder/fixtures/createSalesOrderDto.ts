import { CreateOrderDto } from "@sales/dto";
import { now } from "@shared/mocks";

export const createSalesOrderDto: CreateOrderDto = new CreateOrderDto();
createSalesOrderDto.orderName = "SLI-10000000001";
createSalesOrderDto.orderDate = now;
createSalesOrderDto.orderNumber = "1001";
createSalesOrderDto.customer = {
  email: "mock.customer@email.com",
  name: "Mock Customer",
};
createSalesOrderDto.lineItems = [
  {
    lineNumber: 1,
    quantity: 1,
    variant: {
      id: "00000000-0000-0000-0000-000000000001",
      sku: "MU-C004-00-18-Black",
      image: "mock_image",
      svg: "mock_svg",
      type: "2DMetalArt",
      option1: {
        name: "Size",
        option: '18"',
        enabled: true,
      },
      option2: {
        name: "Color",
        option: "Black",
        enabled: true,
      },
      option3: {
        option: null,
        name: undefined,
        enabled: false,
      },
      productionData: {
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      },
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
    },
    properties: [
      {
        name: "Name",
        value: "MockName",
      },
    ],
  },
];
createSalesOrderDto.shippingAddress = {
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
createSalesOrderDto.billingAddress = {
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
createSalesOrderDto.accountId = "00000000-0000-0000-0000-000000000001";
