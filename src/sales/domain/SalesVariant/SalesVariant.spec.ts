import { CatalogVariant } from "@catalog/services";
import { MongoSalesVariant } from "@sales/database/mongo/MongoSalesVariant";
import { mockCatalogVariant1 } from "@sales/mocks";
import { cloneDeep } from "lodash";
import { SalesPersonalizationRule, SalesVariant } from ".";

describe("SalesVariant", () => {
  describe("create", () => {
    describe("given a valid CatalogVariant", () => {
      it("should return success", () => {
        const cv: CatalogVariant = mockCatalogVariant1;
        const result = SalesVariant.create(cv);
        expect(result.isFailure).toBe(false);
        const svo = result.value();
        const props = svo.props();
        const expected = {
          ...cv,
        };
        expect(props).toEqual(expected);
      });
    });
    describe("given a CatalogVariant with an invalid Option", () => {
      it("should return failure", () => {
        const clonedVariant = cloneDeep(mockCatalogVariant1);

        const cv: CatalogVariant = clonedVariant;
        clonedVariant.personalizationRules[0].label = null;
        const result = SalesVariant.create(cv);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          inner: [
            {
              inner: [
                {
                  value: {
                    name: "top_text",
                    type: "input",
                    label: null,
                    options: "",
                    pattern: "^[a-zA-Z0-9\\s.\\()&/]*$",
                    required: true,
                    maxLength: 16,
                    placeholder: "Enter up to 16 characters",
                  },
                  reason:
                    "SalesPersonalizationRule must be a valid CustomOption.",
                  name: "InvalidSalesPersonalizationRule",
                  message:
                    "InvalidSalesPersonalizationRule 'null': SalesPersonalizationRule must be a valid CustomOption.",
                },
              ],
              value: {
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
                productionData: {
                  material: "Mild Steel",
                  route: "1",
                  thickness: "0.06",
                },
                personalizationRules: [
                  {
                    name: "top_text",
                    type: "input",
                    label: null,
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
                    options:
                      "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
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
              reason: "FailedToCreatePersonalizationRules",
              name: "InvalidSalesVariant",
              message:
                "InvalidSalesVariant '00000000-0000-0000-0000-000000000001' 'MU-C004-00-18-Black': FailedToCreatePersonalizationRules",
            },
          ],
          value: {
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
            productionData: {
              material: "Mild Steel",
              route: "1",
              thickness: "0.06",
            },
            personalizationRules: [
              {
                name: "top_text",
                type: "input",
                label: null,
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
          reason: "Failed to create SalesVariant. See inner error for details.",
          name: "InvalidSalesVariant",
          message:
            "InvalidSalesVariant '00000000-0000-0000-0000-000000000001' 'MU-C004-00-18-Black': Failed to create SalesVariant. See inner error for details.",
        };
        expect(error).toEqual(expected);
      });
    });
  });
  describe("load", () => {
    describe("given valid MongoSalesVariant", () => {
      it("should return SalesVariant", () => {
        const clonedVariant = cloneDeep(mockCatalogVariant1);
        const mockVariant: MongoSalesVariant = {
          id: clonedVariant.id,
          sku: clonedVariant.sku,
          image: clonedVariant.image,
          svg: clonedVariant.svg,
          type: clonedVariant.type,
          option1: clonedVariant.option1,
          option2: clonedVariant.option2,
          option3: clonedVariant.option3,
          manufacturingCost: clonedVariant.manufacturingCost,
          shippingCost: clonedVariant.shippingCost,
          weight: clonedVariant.weight,
          productionData: clonedVariant.productionData,
          personalizationRules: clonedVariant.personalizationRules.map((r) =>
            SalesPersonalizationRule.from(r).value().value()
          ),
        };
        let result = SalesVariant.db(mockVariant);
        expect(result.isFailure).toBe(false);
        const props = result.value().props();
        const expected = {
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
        };
        expect(props).toEqual(expected);
      });
    });
    describe("given invalid MongoSalesVariant", () => {
      it("should fail", () => {
        const clonedVariant = cloneDeep(mockCatalogVariant1);

        const mockVariant: MongoSalesVariant = {
          id: clonedVariant.id,
          sku: clonedVariant.sku,
          image: clonedVariant.image,
          svg: clonedVariant.svg,
          type: clonedVariant.type,
          option1: clonedVariant.option1,
          option2: clonedVariant.option2,
          option3: clonedVariant.option3,
          manufacturingCost: clonedVariant.manufacturingCost,
          shippingCost: clonedVariant.shippingCost,
          weight: clonedVariant.weight,
          productionData: clonedVariant.productionData,
          personalizationRules: clonedVariant.personalizationRules.map(
            (r) => null
          ),
        };
        let result = SalesVariant.db(mockVariant);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          inner: [
            {
              inner: [
                {
                  value: null,
                  reason:
                    "SalesPersonalizationRule must be a valid CustomOption.",
                  name: "InvalidSalesPersonalizationRule",
                  message:
                    "InvalidSalesPersonalizationRule 'undefined': SalesPersonalizationRule must be a valid CustomOption.",
                },
                {
                  value: null,
                  reason:
                    "SalesPersonalizationRule must be a valid CustomOption.",
                  name: "InvalidSalesPersonalizationRule",
                  message:
                    "InvalidSalesPersonalizationRule 'undefined': SalesPersonalizationRule must be a valid CustomOption.",
                },
                {
                  value: null,
                  reason:
                    "SalesPersonalizationRule must be a valid CustomOption.",
                  name: "InvalidSalesPersonalizationRule",
                  message:
                    "InvalidSalesPersonalizationRule 'undefined': SalesPersonalizationRule must be a valid CustomOption.",
                },
                {
                  value: null,
                  reason:
                    "SalesPersonalizationRule must be a valid CustomOption.",
                  name: "InvalidSalesPersonalizationRule",
                  message:
                    "InvalidSalesPersonalizationRule 'undefined': SalesPersonalizationRule must be a valid CustomOption.",
                },
              ],
              value: {
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
                  total: 650,
                  currency: "USD",
                },
                shippingCost: {
                  total: 1200,
                  currency: "USD",
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
                personalizationRules: [null, null, null, null],
              },
              reason: "FailedToLoadPersonalizationRules",
              name: "InvalidSalesVariant",
              message:
                "InvalidSalesVariant '00000000-0000-0000-0000-000000000001' 'MU-C004-00-18-Black': FailedToLoadPersonalizationRules",
            },
          ],
          value: {
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
              total: 650,
              currency: "USD",
            },
            shippingCost: {
              total: 1200,
              currency: "USD",
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
            personalizationRules: [null, null, null, null],
          },
          reason: "Failed to load SalesVariant. See inner error for details.",
          name: "InvalidSalesVariant",
          message:
            "InvalidSalesVariant '00000000-0000-0000-0000-000000000001' 'MU-C004-00-18-Black': Failed to load SalesVariant. See inner error for details.",
        };
        expect(error).toEqual(expected);
      });
    });
  });
});
