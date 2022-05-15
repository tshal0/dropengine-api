import { IWeight, Weight } from "./Weight";

describe("Weight", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Weight();
    const expected: IWeight = { units: "g", dimension: 0 };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props: IWeight = { units: "oz", dimension: 100 };
    const val = new Weight(props);
    const expected: IWeight = { units: "oz", dimension: 100 };
    expect(val.raw()).toEqual(expected);
  });
});
