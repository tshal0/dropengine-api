import { Dimension, IDimension, InvalidDimension } from ".";

describe("Dimension", () => {
  describe("given valid value, units", () => {
    it(`should return OK`, () => {
      let dto: IDimension = { units: "in", dimension: 1 };
      let result = Dimension.from(dto);
      expect(result.isFailure).toBe(false);
      let value = result.value().value();
      expect(value).toMatchObject(dto);
    });
  });
  describe("given invalid units", () => {
    it(`should return InvalidDimension: 'asdf' must be in or mm.`, () => {
      let dto: IDimension = { units: "asdf" as unknown as "in", dimension: 1 };
      let result = Dimension.from(dto);
      expect(result.isFailure).toBe(true);
      let err = result.error;
      expect(err).toEqual({
        message: "InvalidDimension: 'asdf' must be 'in' or 'mm'.",
        name: "InvalidDimension",
        reason: "'asdf' must be 'in' or 'mm'.",
        value: {
          dimension: 1,
          units: "asdf" as unknown as "in",
        },
      } as InvalidDimension);
    });
  });
  describe("given invalid dimension: empty string", () => {
    it(`should return InvalidDimension: Not a number.`, () => {
      let dto: IDimension = { units: "in", dimension: "" as unknown as number };
      let result = Dimension.from(dto);
      expect(result.isFailure).toBe(true);
      let err = result.error;
      expect(err).toEqual({
        message: "InvalidDimension: '' is not a number.",
        name: "InvalidDimension",
        reason: "'' is not a number.",
        value: {
          dimension: "" as unknown as number,
          units: "in",
        },
      } as InvalidDimension);
    });
  });
});
