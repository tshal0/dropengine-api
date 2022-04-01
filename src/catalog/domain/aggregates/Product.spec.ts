import { UUID } from "@shared/domain/valueObjects";
import moment from "moment";
import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";
import { Product } from "..";
import { IProductProps } from "../interfaces";
import {
  ICustomOption,
  ICustomOptionProps,
} from "../valueObjects/CustomOption/CustomOption";
import { invalidProductOnCreate } from "./fixtures";
import { productGenFailVariantResult } from "./fixtures/productGenerateFailed.variants.result";
import { ProductVariant } from "./ProductVariant";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`Product`, () => {
  const mockProdTypeId = "00000000-0000-0000-0000-000000000001";
  const mockProdTypeUuid = UUID.from(mockProdTypeId);

  const mockUuid = "00000000-0000-0000-0000-000000000002";
  const mockProdUuid = UUID.from(mockUuid);
  const mockVariantUuidStr = "00000000-0000-0000-0000-000000000003";
  const mockVariantUuid = UUID.from(mockVariantUuidStr);

  const mockGenerateProdId = jest.fn().mockReturnValue(mockProdUuid);
  const mockGenerateVariantId = jest.fn().mockReturnValue(mockVariantUuid);
  const now = moment().toDate();
  const mockSku = "MEM-001-01";
  const mockCategories = "For Him,Nautical,New Arrivals";
  const mockTags = "collection-1,test tag,etc.";
  const mockImg = "image";
  const mockSvg = "svg";
  const customOptionName: ICustomOptionProps = {
    name: "name",
    label: "Name",
    placeholder: "Enter up to 20 characters",
    required: true,
    type: "input",

    maxLength: 20,
    pattern: "^[a-zA-Z0-9\\s.,'/&]*",
  };
  const customOptionInitial: ICustomOptionProps = {
    name: "initial",
    label: "Initial",
    placeholder: "Select your initial here",
    required: true,
    type: "dropdown",

    options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
  };

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
  const variantDto: CreateProductVariantDto = {
    sku: "MEM-000-01-12-Black",
    image: "img",
    option1: { name: "Color", option: "Black", enabled: true },
    option2: { name: "Size", option: "12", enabled: true },
    option3: null,
    height: { dimension: 30, units: "in" },
    width: { dimension: 15, units: "in" },
    weight: { dimension: 120, units: "oz" },
    // baseCost: { total: 11, currency: "USD" },
    // colorCost: { total: 11, currency: "USD" },
    manufacturingCost: { total: 11, currency: "USD" },
    shippingCost: { total: 11, currency: "USD" },
    productId: undefined,
  };
  const baseProductRawProps: IProductProps = {
    id: "00000000-0000-0000-0000-000000000002",
    sku: "MEM-001-01",
    type: "2DMetalArt",

    tags: ["collection-1", "test tag", "etc."],

    image: "image",
    svg: "svg",
    pricingTier: "1",
    customOptions: [
      {
        label: "Bottom Text",
        maxLength: 12,
        name: "bottom_text",
        options: undefined,
        pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
        placeholder: "Enter up to 12 characters",
        required: true,
        type: "input",
      },
      {
        label: "Initial",
        maxLength: undefined,
        name: "initial",
        options: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
        pattern: undefined,
        placeholder: "Select your initial here",
        required: true,
        type: "dropdown",
      },
      {
        label: "Name",
        maxLength: 20,
        name: "name",
        options: undefined,
        pattern: "^[a-zA-Z0-9\\s.,'/&]*",
        placeholder: "Enter up to 20 characters",
        required: true,
        type: "input",
      },
      {
        label: "Top Text",
        maxLength: 12,
        name: "top_text",
        options: undefined,
        pattern: "^[a-zA-Z0-9\\s.,()&$#@/]*$",
        placeholder: "Enter up to 12 characters",
        required: true,
        type: "input",
      },
    ],

    updatedAt: now,
    createdAt: now,
    variants: [],
  };
  describe("create", () => {
    const dto: CreateProductDto = Object.seal({
      productTypeId: mockProdTypeId,
      type: "2DMetalArt",
      sku: mockSku,
      tags: mockTags,
      categories: mockCategories,
      image: "image",
      svg: "svg",
      pricingTier: "1",
      customOptions: [
        customOptionBottom,
        customOptionInitial,
        customOptionName,
        customOptionTop,
      ],
    });
    describe("with valid DTO", () => {
      it(`should generate a valid Product`, () => {
        Product.generateUuid = mockGenerateProdId;
        ProductVariant.generateUuid = mockGenerateVariantId;

        let result = Product.create(dto);
        expect(result.isFailure).toBe(false);
        let product = result.value();
        let props = product.props();

        expect(props).toMatchObject(baseProductRawProps);
      });
    });

    describe("with invalid CustomOptions", () => {
      it(`should return Result with InvalidCustomOptionErrors`, () => {
        Product.generateUuid = mockGenerateProdId;
        let result = Product.create({
          ...dto,
          // variants: [],
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
              maxLength: undefined,
              name: "initial",
              options: "",
              pattern: undefined,
              placeholder: "Select your initial here",
              required: true,
              type: "dropdown",
            },
          ],
        });
        expect(result.isFailure).toBe(true);
        let error = result.error;
        expect(error).toEqual(invalidProductOnCreate);
      });
    });
    describe("with invalid SKU", () => {});
    describe("with missing ProductType", () => {});
  });
});
