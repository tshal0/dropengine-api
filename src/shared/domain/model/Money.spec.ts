import { IMoney, Money } from "./Money";

describe("Money", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new Money();
    const expected: IMoney = { currency: "USD", total: 0 };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props: IMoney = { currency: "USD", total: 1000 };
    const val = new Money(props);
    const expected: IMoney = { currency: "USD", total: 1000 };
    expect(val.raw()).toEqual(expected);
  });
});
