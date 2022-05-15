import { IDimension, Dimension } from "./Dimension";

describe("Dimension", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Dimension();
    const expected: IDimension = { units: "mm", dimension: 0 };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props: IDimension = { units: "mm", dimension: 200 };
    const val = new Dimension(props);
    const expected: IDimension = { units: "mm", dimension: 200 };
    expect(val.raw()).toEqual(expected);
  });
});
