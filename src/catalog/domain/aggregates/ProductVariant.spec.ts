import { UUID } from "@shared/domain/valueObjects";
import moment from "moment";
import { CreateProductVariantDto } from "catalog/dto/CreateProductVariantDto";
import { IProductVariant, IProductVariantProps } from "../interfaces";
import { ProductVariant } from "./ProductVariant";
import { ProductVariantUUID } from "../valueObjects/ProductVariant/VariantUUID";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`ProductVariant`, () => {
  const mockUuid = "00000000-0000-0000-0000-000000000001";
  const mockProdUuid = ProductVariantUUID.from(mockUuid);
  const mock0Id = 0;
  const mockId = 1;
  const mockGenerateProdId = jest.fn().mockReturnValue(mockProdUuid);
  const now = moment().toDate();
  const mockSku = "MEM-001-01";
  const mockCategories = "For Him,Nautical,New Arrivals";
  const mockTags = "collection-1,test tag,etc.";
  const mockImg = "image";
  const mockSvg = "svg";

  describe("create", () => {
    describe("with a valid DTO", () => {
      const dto: CreateProductVariantDto = {
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
        productUuid: undefined,
      };
      it(`should generate a valid ProductVariant`, () => {
        ProductVariant.generateUuid = mockGenerateProdId;
        let result = ProductVariant.create(dto);
        expect(result.isFailure).toBe(false);
        let props = result.value().props();
        console.log(JSON.stringify(props, null, 2));
        expect(props).toEqual({
          uuid: "00000000-0000-0000-0000-000000000001",
          sku: "MEM-000-01-12-Black",
          image: "img",
          option1: {
            name: "Color",
            option: "Black",
            enabled: true,
          },
          option2: {
            name: "Size",
            option: "12",
            enabled: true,
          },
          option3: {
            name: null,
            option: null,
            enabled: false,
          },
          height: {
            dimension: 30,
            units: "in",
          },
          width: {
            dimension: 15,
            units: "in",
          },
          weight: {
            dimension: 120,
            units: "oz",
          },
          // baseCost: {
          //   total: 11,
          //   currency: "USD",
          // },
          // colorCost: {
          //   total: 11,
          //   currency: "USD",
          // },
          manufacturingCost: {
            total: 11,
            currency: "USD",
          },
          shippingCost: {
            total: 11,
            currency: "USD",
          },
          product: null,
          createdAt: now,
          updatedAt: now,
          // basePrice: {
          //   total: 11,
          //   currency: "USD",
          // },
          // compareAtPrice: {
          //   total: 11,
          //   currency: "USD",
          // },
        } as IProductVariantProps);
      });
    });
  });
});
