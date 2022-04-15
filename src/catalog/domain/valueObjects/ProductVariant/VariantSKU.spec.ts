import { VariantSKU } from "./VariantSKU";

describe("VariantSKU", () => {
  describe("given valid, 5 element SKU", () => {
    it(`should return OK`, () => {
      let skuString = "MEM-001-01-12-Black";
      let skuResult = VariantSKU.from(skuString);

    
      expect(skuResult.isFailure).toBe(false);
      let sku = skuResult.value().value();
      expect(sku).toEqual(skuString);
    });
  });
  describe("given invalid SKU", () => {
    describe("null", () => {
      it(`should return InvalidVariantSKU`, () => {
        let skuString = null;
        let skuResult = VariantSKU.from(skuString);

       
        expect(skuResult.isFailure).toBe(true);
        let error = skuResult.error;
        expect(error).toEqual({
          message: `InvalidVariantSKU 'null': Expected valid SKU, received 'null'.`,
          name: `InvalidVariantSKU`,
          reason: `Expected valid SKU, received 'null'.`,
          value: null,
        });
      });
    });
    describe("undefined", () => {
      it(`should return InvalidVariantSKU`, () => {
        let skuString = undefined;
        let skuResult = VariantSKU.from(skuString);

        
        expect(skuResult.isFailure).toBe(true);
        let error = skuResult.error;
        expect(error).toEqual({
          message: `InvalidVariantSKU 'undefined': Expected valid SKU, received 'undefined'.`,
          name: `InvalidVariantSKU`,
          reason: `Expected valid SKU, received 'undefined'.`,
          value: undefined,
        });
      });
    });
    describe("empty", () => {
      it(`should return InvalidVariantSKU`, () => {
        let skuString = "";
        let skuResult = VariantSKU.from(skuString);

       
        expect(skuResult.isFailure).toBe(true);
        let error = skuResult.error;
        expect(error).toEqual({
          message: `InvalidVariantSKU '': Expected non-empty SKU, received ''.`,
          name: `InvalidVariantSKU`,
          reason: `Expected non-empty SKU, received ''.`,
          value: "",
        });
      });
    });
    describe("< 5 elements", () => {
      it(`should return InvalidVariantSKU`, () => {
        let skuString = "MEM-000-01";
        let skuResult = VariantSKU.from(skuString);

       
        expect(skuResult.isFailure).toBe(true);
        let error = skuResult.error;
        expect(error).toEqual({
          message: `InvalidVariantSKU 'MEM-000-01': Expected at least 5 SKU elements, received 3.`,
          name: `InvalidVariantSKU`,
          reason: `Expected at least 5 SKU elements, received 3.`,
          value: "MEM-000-01",
        });
      });
    });
  });
});
