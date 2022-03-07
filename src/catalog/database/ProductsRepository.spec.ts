import { ProductsRepository } from "./ProductsRepository";
import { Product } from "catalog/domain";
import {
  baseDbProduct,
  baseProductProps,
  newDbProduct,
  newProductProps,
} from "./fixtures/productsRepository.mocks";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());

describe("ProductsRepository", () => {
  describe("fromDb", () => {
    describe("given valid DbProduct", () => {
      it(`should load a valid Product`, () => {
        const result = ProductsRepository.fromDb(baseDbProduct);
        expect(result.isFailure).toBe(false);
        let props = result.value().props();

        expect(props).toMatchObject(baseProductProps);
      });
    });
  });
  describe("toDb", () => {
    describe("given new Product", () => {
      it("should generate valid DbProduct", () => {
        let result = Product.db(newDbProduct);
        expect(result.isFailure).toBe(false);
        let product = result.value();
        let dbProductResult = ProductsRepository.toDb(product);
        expect(dbProductResult.isFailure).toBe(false);
        let dbProduct = dbProductResult.value().props();
        expect(dbProduct).toMatchObject({ ...newProductProps });
      });
    });
    describe("given existing Product", () => {
      // see baseProductProps

      it("should generate valid DbProduct", () => {
        let result = Product.db(baseDbProduct);
        expect(result.isFailure).toBe(false);
        let product = result.value();
        let dbProductResult = ProductsRepository.toDb(product);
        expect(dbProductResult.isFailure).toBe(false);
        let dbProduct = dbProductResult.value().props();
        expect(dbProduct).toMatchObject(baseProductProps);
      });
    });
  });
});
