import { InvalidWeight, IWeight, Weight } from ".";

describe("Weight", () => {
  describe("given valid value, units", () => {
    it(`should return OK`, () => {
      let dto: IWeight = { units: "g", dimension: 1 };
      let result = Weight.from(dto);
      expect(result.isFailure).toBe(false);
      let value = result.value().value();
      expect(value).toMatchObject(dto);
    });
  });
  describe("given invalid units", () => {
    it(`should return InvalidWeight: 'asdf' must be in or mm.`, () => {
      let dto: IWeight = { units: "asdf" as unknown as "g", dimension: 1 };
      let result = Weight.from(dto);
      expect(result.isFailure).toBe(true);
      let err = result.error;
      expect(err).toEqual({
        message: "InvalidWeight: 'asdf' must be 'oz' or 'g'.",
        name: "InvalidWeight",
        reason: "'asdf' must be 'oz' or 'g'.",
        value: {
          dimension: 1,
          units: "asdf" as unknown as "g",
        },
      } as InvalidWeight);
    });
  });
  describe("given invalid dimension: empty string", () => {
    it(`should return InvalidWeight: Not a number.`, () => {
      let dto: IWeight = { units: "g", dimension: "" as unknown as number };
      let result = Weight.from(dto);
      console.log(result);
      expect(result.isFailure).toBe(true);
      let err = result.error;
      expect(err).toEqual({
        message: "InvalidWeight: '' is not a number.",
        name: "InvalidWeight",
        reason: "'' is not a number.",
        value: {
          dimension: "" as unknown as number,
          units: "g",
        },
      } as InvalidWeight);
    });
  });
});
