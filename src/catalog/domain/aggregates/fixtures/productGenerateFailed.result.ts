export const invalidProductOnCreate = {
  message:
    "InvalidProduct 'MEM-001-01': Failed to create Product. See inner error for details.",
  name: "InvalidProduct",
  reason: "Failed to create Product. See inner error for details.",
  inner: [
    {
      name: "InvalidCustomOptions",
      message: "Invalid CustomOptions were found.",
      inner: [
        {
          name: "InvalidCustomOption",
          message: "Invalid CustomOption 'null' was found.",
          inner: [
            {
              value: null,
              name: "INVALID_CUSTOM_OPTION_NAME",
              message: "Name 'null' must not be empty.",
            },
            {
              value: null,
              name: "INVALID_CUSTOM_OPTION_LABEL",
              message: "Label 'null' must not be empty.",
            },
            {
              value: null,
              name: "INVALID_CUSTOM_OPTION_PLACEHOLDER",
              message: "Placeholder 'null' must not be empty.",
            },
            {
              value: null,
              name: "INVALID_CUSTOM_OPTION_REQUIRED",
              message: "Required 'null' must be a boolean value.",
            },
            {
              value: null,
              name: "INVALID_CUSTOM_OPTION_TYPE",
              message:
                "Type 'null' must be one of the following: input, dropdownlist, select, dropdown, text",
            },
          ],
          value: {
            label: null,
            name: null,
            placeholder: null,
            required: null,
            type: null,
            maxLength: null,
            options: null,
            pattern: null,
          },
        },
        {
          name: "InvalidCustomOption",
          message: "Invalid CustomOption 'Initial' was found.",
          inner: [
            {
              value: "",
              name: "INVALID_CUSTOM_OPTION_OPTIONS",
              message: "Options '' must have values with Type 'dropdown'.",
            },
          ],
          value: {
            label: "Initial",
            name: "initial",
            placeholder: "Select your initial here",
            required: true,
            type: "dropdown",
            options: "",
          },
        },
      ],
      value: {
        customOptions: [
          {
            label: null,
            maxLength: null,
            name: null,
            options: null,
            pattern: null,
            placeholder: null,
            required: null,
            type: null,
          },
          {
            label: "Initial",
            name: "initial",
            options: "",
            placeholder: "Select your initial here",
            required: true,
            type: "dropdown",
          },
        ],
      },
    },
  ],
  value: {
    productTypeId: "00000000-0000-0000-0000-000000000001",
    sku: "MEM-001-01",
    pricingTier: "1",
    tags: "collection-1,test tag,etc.",
    categories: "For Him,Nautical,New Arrivals",
    image: "image",
    svg: "svg",
    type: "2DMetalArt",
    customOptions: [
      {
        label: null,
        maxLength: null,
        name: null,
        options: null,
        pattern: null,
        placeholder: null,
        required: null,
        type: null,
      },
      {
        label: "Initial",
        name: "initial",
        options: "",
        placeholder: "Select your initial here",
        required: true,
        type: "dropdown",
      },
    ],
    // variants: [],
  },
};
