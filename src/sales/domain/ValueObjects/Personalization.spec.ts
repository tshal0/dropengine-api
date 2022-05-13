import {
  mockCatalogVariant1,
  mockTopText,
  mockBottomText,
  mockInitial,
  mockMiddleText,
} from "@sales/mocks";
import { ISalesLineItemProps } from "../SalesLineItem";
import { ISalesVariantProps, SalesPersonalizationRule } from "../SalesVariant";
import { Personalization } from "./Personalization";

const mockOrderId = "000000000000000000000002";

describe("Personalization", () => {
  describe("validate", () => {
    describe("given invalid line item properties", () => {
      it("should fail", () => {
        const mockVariant: ISalesVariantProps = {
          id: mockCatalogVariant1.id,
          sku: mockCatalogVariant1.sku,
          image: mockCatalogVariant1.image,
          svg: mockCatalogVariant1.svg,
          type: mockCatalogVariant1.type,
          option1: mockCatalogVariant1.option1,
          option2: mockCatalogVariant1.option2,
          option3: mockCatalogVariant1.option3,
          manufacturingCost: mockCatalogVariant1.manufacturingCost,
          shippingCost: mockCatalogVariant1.shippingCost,
          weight: mockCatalogVariant1.weight,
          productionData: mockCatalogVariant1.productionData,
          personalizationRules: mockCatalogVariant1.personalizationRules.map(
            (r) => SalesPersonalizationRule.from(r).value().value()
          ),
        };
        const mockProps: ISalesLineItemProps = {
          lineNumber: 1,
          quantity: 1,
          variant: mockVariant,
          personalization: [
            { name: mockTopText, value: "InvalidLengthText12345" },
            { name: mockBottomText, value: "Bad-Character" },
            { name: mockInitial, value: "M" },
          ],
          flags: [],
        };
        const flags = Personalization.validate(mockProps);
        const expected = [
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
        ];
        expect(flags?.length).toBe(3);
        expect(flags).toEqual(expected);
      });
    });
    describe("given valid line item properties", () => {
      it("should succeed", () => {
        const mockVariant: ISalesVariantProps = {
          id: mockCatalogVariant1.id,
          sku: mockCatalogVariant1.sku,
          image: mockCatalogVariant1.image,
          svg: mockCatalogVariant1.svg,
          type: mockCatalogVariant1.type,
          option1: mockCatalogVariant1.option1,
          option2: mockCatalogVariant1.option2,
          option3: mockCatalogVariant1.option3,
          manufacturingCost: mockCatalogVariant1.manufacturingCost,
          shippingCost: mockCatalogVariant1.shippingCost,
          weight: mockCatalogVariant1.weight,
          productionData: mockCatalogVariant1.productionData,
          personalizationRules: mockCatalogVariant1.personalizationRules.map(
            (r) => SalesPersonalizationRule.from(r).value().value()
          ),
        };
        const mockProps: ISalesLineItemProps = {
          lineNumber: 1,
          quantity: 1,
          variant: mockVariant,
          personalization: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
          flags: [],
        };
        const flags = Personalization.validate(mockProps);
        const expected = [];
        expect(flags?.length).toBe(0);
        expect(flags).toEqual(expected);
      });
    });
  });
});
