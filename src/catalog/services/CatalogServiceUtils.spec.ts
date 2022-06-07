import { MESMetalArtMocks } from "@catalog/mocks";
import { cloneDeep } from "lodash";
import { CreateProductDto, CreateVariantDto } from "..";
import {
  generateProductFromMESVariant,
  generateVariantFromMESVariant,
} from "./CatalogServiceUtils";

describe("CatalogServiceUtils", () => {
  describe("generateProductFromMESVariant", () => {
    it("should generate valid Product from MetalArt variant", () => {
      // GIVEN
      let mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);
      // WHEN
      let result = generateProductFromMESVariant(mesVariant);
      const expected: CreateProductDto = {
        categories:
          "Nautical Designs,Simple Products,For Her,Steel Monograms,All Custom",
        image:
          "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
        personalizationRules: [
          {
            label: "Top Text",
            maxLength: 16,
            name: "top_text",
            options: "",
            pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
            placeholder: "Enter up to 16 characters",
            required: true,
            type: "input",
          },
          {
            label: "Bottom Text",
            maxLength: 16,
            name: "bottom_text",
            options: "",
            pattern: "^[a-zA-Z0-9\\s!?.,\\’”()&$%#@/]*$",
            placeholder: "Enter up to 16 characters",
            required: true,
            type: "input",
          },
        ],
        pricingTier: "2",
        sku: "MU-C011-00",
        svg: "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/6364995934/4135624991/MU-C011-00.svg",
        tags: "",
        type: "2DMetalArt",
      };
      // THEN
      expect(result).toEqual(expected);
    });
  });

  describe("generateVariantFromMESVariant", () => {
    it("should generate valid Variant from MetalArt variant", () => {
      // GIVEN
      let mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);
      // WHEN
      let result = generateVariantFromMESVariant(mesVariant);
      const expected: CreateVariantDto = {
        productSku: "MU-C011-00",
        sku: "MU-C011-00-12-Black",
        type: "2DMetalArt",
        image:
          "https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/Product/01+-+Product+Variant+Images/01+-+White+Backdrop/MU-C011-00-Black.png",
        option1: {
          name: "color",
          value: "Black",
        },
        option2: {
          name: "size",
          value: '12"',
        },
        option3: {
          name: "",
          value: null,
        },
        height: {
          dimension: 0,
          units: "mm",
        },
        weight: {
          dimension: 352,
          units: "oz",
        },
        width: {
          dimension: 0,
          units: "mm",
        },
        manufacturingCost: {
          currency: "USD",
          total: 600,
        },
        shippingCost: {
          currency: "USD",
          total: 750,
        },
      };
      // THEN
      expect(result).toEqual(expected);
    });
  });
});
