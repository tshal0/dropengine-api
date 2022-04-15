import { mockUuid1 } from "./mocks";

export const invalidPersonalization = (now) => ({
  orderName: "SLI-1000",
  accountId: mockUuid1,
  orderNumber: 1000,
  orderDate: now,
  orderStatus: "OPEN",
  lineItems: [
    {
      id: null,
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
          enabled: false,
        },
        manufacturingCost: {
          currency: "USD",
          total: 650,
        },
        shippingCost: {
          currency: "USD",
          total: 1200,
        },
        weight: {
          units: "oz",
          dimension: 738,
        },
        productionData: {
          material: "Mild Steel",
          route: "1",
          thickness: "0.06",
        },
        personalizationRules: [
          {
            name: "top_text",
            label: "Top Text",
            placeholder: "Enter up to 16 characters",
            required: true,
            type: "input",
            maxLength: 16,
            pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            options: "",
          },
          {
            name: "middle_text",
            label: "Middle Text",
            placeholder: "Enter up to 14 characters",
            required: true,
            type: "input",
            maxLength: 14,
            pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            options: "",
          },
          {
            name: "bottom_text",
            label: "Bottom Text",
            placeholder: "Enter up to 16 characters",
            required: true,
            type: "input",
            maxLength: 16,
            pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            options: "",
          },
          {
            name: "initial",
            label: "Initial",
            placeholder: "Select Initial",
            required: true,
            type: "dropdownlist",
            maxLength: null,
            options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
          },
        ],
      },
      personalization: [
        {
          name: "Top Text",
          value: "TooLongExample1234",
        },
        {
          name: "Bottom Text",
          value: "Bad-Character",
        },
        {
          name: "Initial",
          value: "M",
        },
      ],
      flags: [
        {
          type: "InvalidPersonalization",
          details: {
            lineNumber: 1,
            property: "Top Text",
            reason: "INVALID_LENGTH",
          },
          message:
            "Line Item #1 has invalid property 'Top Text': 'undefined'. Reason: INVALID_LENGTH",
        },
        {
          type: "MissingPersonalization",
          details: {
            lineNumber: 1,
            property: "Middle Text",
            reason: "MISSING",
          },
          message: "Line Item #1 is missing property 'Middle Text'.",
        },
        {
          type: "BadCharacter",
          details: {
            lineNumber: 1,
            property: "Bottom Text",
            value: "Bad-Character",
            pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
            reason: "BAD_CHARACTER",
          },
          message:
            "Line Item #1 has a bad character in property 'Bottom Text': 'Bad-Character'. Reason: BAD_CHARACTER",
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ],
  customer: {
    email: "mock.customer@email.com",
    name: "Mock Customer",
  },
  shippingAddress: {
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
    longitude: -82.1265222,
    province: "Ohio",
    lastName: "Stark",
    firstName: "Tony",
    countryCode: "US",
    provinceCode: "OH",
  },
  billingAddress: {
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
    longitude: -82.1265222,
    province: "Ohio",
    lastName: "Stark",
    firstName: "Tony",
    countryCode: "US",
    provinceCode: "OH",
  },
  createdAt: now,
  updatedAt: now,
});
