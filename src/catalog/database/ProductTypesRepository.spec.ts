import { ProductTypesRepository } from "./ProductTypesRepository";
import { Product } from "catalog/domain";
import {
  baseCreateProductTypeDto,
  baseDbProdTypeProps,
  baseDbProductType,
} from "./fixtures/productTypesRepo.mocks";
import { ProductType } from "catalog/domain/aggregates/ProductType";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());

describe("ProductTypesRepository", () => {
  describe("fromDb", () => {
    describe("given valid DbProduct", () => {
      it(`should load a valid Product`, () => {
        const result = ProductTypesRepository.fromDb(baseDbProductType);
        expect(result.isFailure).toBe(false);
        let props = result.value().props();

        expect(props).toEqual(baseDbProdTypeProps);
      });
    });

    describe("toDb", () => {
      describe("given new Product", () => {
        it("should generate valid DbProduct", () => {
          let result = ProductType.db(baseDbProductType);
          expect(result.isFailure).toBe(false);
          let product = result.value();
          let dbProductResult = ProductTypesRepository.toDb(product);
          expect(dbProductResult.isFailure).toBe(false);
          let dbProduct = dbProductResult.value();
          expect(dbProduct).toEqual({ ...baseDbProductType, id: undefined });
        });
      });
      describe("given existing Product", () => {
        // see baseProductProps

        it("should generate valid DbProduct", () => {
          let result = ProductType.db(baseDbProductType);
          expect(result.isFailure).toBe(false);
          let product = result.value();
          let dbProductResult = ProductTypesRepository.toDb(product);
          expect(dbProductResult.isFailure).toBe(false);
          let dbProduct = dbProductResult.value();
          expect(dbProduct).toEqual(baseDbProductType);
        });
      });
    });
  });
});
