import { MongoLineItem, MongoSalesVariant } from "@sales/database";
import { CreateLineItemDto } from "@sales/dto";
import moment from "moment";
import { Types } from "mongoose";

import { LineItem } from ".";
import { SalesPersonalizationRule } from "..";
import {
  mockCatalogVariant1,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
} from "../SalesOrder/fixtures/mocks";

const nowStr = "2021-01-01T00:00:00.000Z";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date(nowStr).valueOf());

describe("LineItem", () => {
  const now = moment().toDate();
  describe("create", () => {
    describe("given valid CreateLineItemDto", () => {
      it("should return LineItem", () => {
        const mockLineItem1: CreateLineItemDto = {
          lineNumber: 1,
          quantity: 1,
          variant: mockCatalogVariant1,
          properties: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
        };
        let result = LineItem.create(mockLineItem1);
        expect(result.isFailure).toBe(false);
        const props = result.value().props();
        const expected = {
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
              value: "ValidText",
            },
            {
              name: "Middle Text",
              value: "ValidText",
            },
            {
              name: "Bottom Text",
              value: "ValidText",
            },
            {
              name: "Initial",
              value: "M",
            },
          ],
          flags: [],
          createdAt: now,
          updatedAt: now,
        };
        expect(props).toEqual(expected);
      });
    });
    describe("given CreateLineItemDto with no variant", () => {
      it("should fail", () => {
        const mockLineItem1: CreateLineItemDto = {
          lineNumber: 1,
          quantity: 1,
          variant: null,
          properties: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
        };
        let result = LineItem.create(mockLineItem1);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          inner: [
            {
              inner: [],
              value: null,
              reason:
                "Failed to create SalesVariant: CatalogVariant was undefined.",
              name: "InvalidSalesVariant",
              message:
                "InvalidSalesVariant 'undefined' 'undefined': Failed to create SalesVariant: CatalogVariant was undefined.",
            },
          ],
          value: {
            lineNumber: 1,
            quantity: 1,
            variant: null,
            properties: [
              {
                name: "Top Text",
                value: "ValidText",
              },
              {
                name: "Middle Text",
                value: "ValidText",
              },
              {
                name: "Bottom Text",
                value: "ValidText",
              },
              {
                name: "Initial",
                value: "M",
              },
            ],
          },
          reason: "Failed to create LineItem. See inner error for details.",
          name: "InvalidLineItem",
          message:
            "InvalidLineItem 'undefined' '1': Failed to create LineItem. See inner error for details.",
        };
        expect(error).toEqual(expected);
      });
    });
  });
  describe("db", () => {
    describe("given valid MongoLineItem", () => {
      it("should return LineItem", () => {
        const mockVariant: MongoSalesVariant = {
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
        const mockLineItem1: MongoLineItem = {
          _id: new Types.ObjectId("00000000515bd494ed80cfbd"),
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
          updatedAt: now,
          createdAt: now,
        };
        let result = LineItem.load(mockLineItem1);
        expect(result.isFailure).toBe(false);
        const props = result.value().props();
        const expected = {
          id: "00000000515bd494ed80cfbd",
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
              value: "ValidText",
            },
            {
              name: "Middle Text",
              value: "ValidText",
            },
            {
              name: "Bottom Text",
              value: "ValidText",
            },
            {
              name: "Initial",
              value: "M",
            },
          ],
          flags: [],
          createdAt: now,
          updatedAt: now,
        };
        expect(props).toEqual(expected);
      });
    });
    describe("given invalid MongoLineItem", () => {
      it("should fail", () => {
        const mockId = "00000000515bd494ed80cfbd";
        const mockObjectId = new Types.ObjectId(mockId);
        const mockLineItem1: MongoLineItem = {
          _id: mockObjectId,
          id: mockId,
          lineNumber: 1,
          quantity: 1,
          variant: null,
          personalization: [
            { name: mockTopText, value: "ValidText" },
            { name: mockMiddleText, value: "ValidText" },
            { name: mockBottomText, value: "ValidText" },
            { name: mockInitial, value: "M" },
          ],
          flags: [],
          updatedAt: now,
          createdAt: now,
        };
        let result = LineItem.load(mockLineItem1);
        expect(result.isFailure).toBe(true);
        const error = result.error;
        const expected = {
          inner: [
            {
              inner: [],
              value: null,
              reason:
                "Failed to load SalesVariant: MongoSalesVariant is undefined.",
              name: "InvalidSalesVariant",
              message:
                "InvalidSalesVariant 'undefined' 'undefined': Failed to load SalesVariant: MongoSalesVariant is undefined.",
            },
          ],
          value: {
            _id: mockObjectId,
            id: mockId,
            lineNumber: 1,
            quantity: 1,
            variant: null,
            personalization: [
              {
                name: "Top Text",
                value: "ValidText",
              },
              {
                name: "Middle Text",
                value: "ValidText",
              },
              {
                name: "Bottom Text",
                value: "ValidText",
              },
              {
                name: "Initial",
                value: "M",
              },
            ],
            flags: [],
            updatedAt: now,
            createdAt: now,
          },
          reason: "Failed to load LineItem. See inner error for details.",
          name: "InvalidLineItem",
          message: `InvalidLineItem '${mockId}' '1': Failed to load LineItem. See inner error for details.`,
        };
        expect(error).toMatchObject(expected);
      });
    });
  });
});
