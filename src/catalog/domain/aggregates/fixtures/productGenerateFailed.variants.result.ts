
export const productGenFailVariantResult = {
  inner: [
    {
      inner: [
        {
          inner: [
            {
              value: "MEM-000-01",
              reason: "Expected at least 5 SKU elements, received 3.",
              name: "InvalidVariantSKU",
              message:
                "InvalidVariantSKU 'MEM-000-01': Expected at least 5 SKU elements, received 3.",
            },
            {
              value: {
                dimension: "30",
                units: "in",
              },
              reason: "'30' is not a number.",
              name: "InvalidDimension",
              message: "InvalidDimension: '30' is not a number.",
            },
            {
              value: {
                dimension: 15,
                units: "asdf",
              },
              reason: "'asdf' must be 'in' or 'mm'.",
              name: "InvalidDimension",
              message: "InvalidDimension: 'asdf' must be 'in' or 'mm'.",
            },
            {
              value: {
                dimension: 120,
                units: "asfd",
              },
              reason: "'asfd' must be 'oz' or 'g'.",
              name: "InvalidWeight",
              message: "InvalidWeight: 'asfd' must be 'oz' or 'g'.",
            },
            {
              value: {
                total: 11.5,
                currency: "USD",
              },
              reason:
                "'11.5' is not an integer. Please use a round number, with no decimals.",
              name: "InvalidMoneyTotal",
              message:
                "InvalidMoneyTotal: '11.5' is not an integer. Please use a round number, with no decimals.",
            },
            {
              value: {
                total: 11,
                currency: "asdf",
              },
              reason: "'asdf' is not a valid currency. Please use 'USD'.",
              name: "InvalidMoneyCurrency",
              message:
                "InvalidMoneyCurrency: 'asdf' is not a valid currency. Please use 'USD'.",
            },
          ],
          value: {
            sku: "MEM-000-01",
          },
          reason:
            "Failed to generate Variant for options 'null:Black', 'Size:null'. See inner error for details.",
          name: "InvalidProductVariant",
          message:
            "InvalidProductVariant 'MEM-000-01': Failed to generate Variant for options 'null:Black', 'Size:null'. See inner error for details.",
        },
      ],
      value: {
        variants: [
          {
            sku: "MEM-000-01",
            image: null,
            option1: {
              name: null,
              option: "Black",
              enabled: true,
            },
            option2: {
              name: "Size",
              option: null,
              enabled: true,
            },
            option3: null,
            height: {
              dimension: "30",
              units: "in",
            },
            width: {
              dimension: 15,
              units: "asdf",
            },
            weight: {
              dimension: 120,
              units: "asfd",
            },
            baseCost: {
              total: 11.5,
              currency: "USD",
            },
            colorCost: {
              total: 11,
              currency: "asdf",
            },
            manufacturingCost: {
              total: 11,
              currency: "USD",
            },
            shippingCost: {
              total: 11,
              currency: "USD",
            },
            basePrice: {
              total: 11,
              currency: "USD",
            },
            compareAtPrice: {
              total: 11,
              currency: "USD",
            },
          },
        ],
      },
      name: "InvalidProductVariants",
      message: "Invalid ProductVariants were found.",
    },
  ],
  value: {
    productTypeId: "00000000-0000-0000-0000-000000000001",
    sku: "MEM-001-01",
    tags: "collection-1,test tag,etc.",
    categories: "For Him,Nautical,New Arrivals",
    image: "image",
    svg: "svg",
    customOptions: [
      {
        maxLength: 12,
        pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
        type: "input",
        required: true,
        label: "Bottom Text",
        placeholder: "Enter up to 12 characters",
        name: "bottom_text",
      },
      {
        name: "initial",
        label: "Initial",
        placeholder: "Select your initial here",
        required: true,
        type: "dropdown",
        options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
      },
      {
        name: "name",
        label: "Name",
        placeholder: "Enter up to 20 characters",
        required: true,
        type: "input",
        maxLength: 20,
        pattern: "^[a-zA-Z0-9\\s.,'/&]*",
      },
      {
        maxLength: 12,
        pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
        type: "input",
        required: true,
        label: "Top Text",
        placeholder: "Enter up to 12 characters",
        name: "top_text",
      },
    ],
    variants: [
      {
        sku: "MEM-000-01",
        image: null,
        option1: {
          name: null,
          option: "Black",
          enabled: true,
        },
        option2: {
          name: "Size",
          option: null,
          enabled: true,
        },
        option3: null,
        height: {
          dimension: "30",
          units: "in",
        },
        width: {
          dimension: 15,
          units: "asdf",
        },
        weight: {
          dimension: 120,
          units: "asfd",
        },
        baseCost: {
          total: 11.5,
          currency: "USD",
        },
        colorCost: {
          total: 11,
          currency: "asdf",
        },
        manufacturingCost: {
          total: 11,
          currency: "USD",
        },
        shippingCost: {
          total: 11,
          currency: "USD",
        },
        basePrice: {
          total: 11,
          currency: "USD",
        },
        compareAtPrice: {
          total: 11,
          currency: "USD",
        },
      },
    ],
  },
  name: "InvalidProduct",
  message:
    "InvalidProduct 'MEM-001-01': Failed to create Product. See inner error for details.",
  reason: "Failed to create Product. See inner error for details.",
};
