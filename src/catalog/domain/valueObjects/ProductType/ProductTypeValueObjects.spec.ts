import {
  ProductTypeLivePreview,
  ProductTypeManufacturing,
  ProductTypeName,
  ProductTypeOption,
} from ".";

describe("ProductTypeName", () => {
  describe("given a valid string", () => {
    it("should return OK", () => {
      let result = ProductTypeName.from("Test");
      expect(result.isFailure).toBe(false);
      const productType = result.value();
      expect(productType.value()).toBe("Test");
    });
  });
  describe("given invalid string", () => {
    describe("null", () => {
      it("should return InvalidProductTypeName", () => {
        let result = ProductTypeName.from(null);

        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual({
          value: null,
          reason: "Name can not be null.",
          name: "InvalidProductTypeName",
          message: "InvalidProductTypeName 'null': Name can not be null.",
        });
      });
    });
    describe("empty", () => {
      it("should return InvalidProductTypeName", () => {
        let result = ProductTypeName.from("");
        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual({
          value: "",
          reason: "Name can not be empty.",
          name: "InvalidProductTypeName",
          message: "InvalidProductTypeName '': Name can not be empty.",
        });
      });
    });
  });
});
describe("ProductTypeManufacturing", () => {
  describe("given valid Manufacturing Details", () => {
    it(`should return OK`, () => {
      let result = ProductTypeManufacturing.from({
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      });
      expect(result.isFailure).toBe(false);
      const details = result.value();
      expect(details.value()).toEqual({
        material: "Mild Steel",
        route: "1",
        thickness: "0.06",
      });
    });
  });
});
describe("ProductTypeLivePreview", () => {
  describe("given valid LivePreview Details", () => {
    it(`should return OK`, () => {
      let result = ProductTypeLivePreview.from({
        enabled: false,
        link: null,
        name: null,
        version: null,
      });
      expect(result.isFailure).toBe(false);
      const details = result.value();
      expect(details.value()).toEqual({
        enabled: false,
        link: null,
        name: null,
        version: null,
      });
    });
  });
});
describe("ProductTypeOption", () => {
  describe("given valid Options", () => {
    it(`should return OK`, () => {
      let result = ProductTypeOption.from({
        name: "Size",
        values: [
          { enabled: true, name: "Size", value: "12" },
          { enabled: true, name: "Size", value: "15" },
          { enabled: false, name: "Size", value: "18" },
          { enabled: true, name: "Size", value: "24" },
          { enabled: false, name: "Size", value: "30" },
        ],
      });
      expect(result.isFailure).toBe(false);
      const prodTypeOption = result.value();
      expect(prodTypeOption.value()).toEqual({
        name: "Size",
        values: [
          { enabled: true, name: "Size", value: "12" },
          { enabled: true, name: "Size", value: "15" },
          { enabled: false, name: "Size", value: "18" },
          { enabled: true, name: "Size", value: "24" },
          { enabled: false, name: "Size", value: "30" },
        ],
      });
    });
  });
  describe("given multiple Names", () => {
    it(`should return OptionNameConflict`, () => {
      let result = ProductTypeOption.from({
        name: "Size",
        values: [
          { enabled: true, name: "Size", value: "12" },
          { enabled: true, name: "Test", value: "15" },
          { enabled: false, name: "Size", value: "18" },
          { enabled: true, name: "Abcd", value: "24" },
          { enabled: false, name: "Size", value: "30" },
        ],
      });
      expect(result.isFailure).toBe(true);
      expect(result.error).toEqual({
        inner: [
          {
            value: {
              parent: "Size",
              conflicts: ["Test", "Abcd"],
            },
            name: "ProductTypeOptionNameConflict",
            message:
              "ProductTypeOptionNameConflict: All ProductTypeOption names must match parent Name: 'Size'. Conflicts: 'Test,Abcd'",
          },
        ],
        value: "Size",
        reason:
          "Errors found while creating ProductTypeOption. See inner for details.",
        name: "InvalidProductTypeOption",
        message:
          "InvalidProductTypeOption 'Size': Errors found while creating ProductTypeOption. See inner for details.",
      });
    });
  });
});
