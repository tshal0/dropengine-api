import { extractOrderNumber } from "./extractOrderNumber";

describe("extractOrderNumber", () => {
  it("should convert normal number properly (12345)", () => {
    let given = `12345`;
    let result = extractOrderNumber(given);
    expect(result).toEqual(12345);
  });
  it("should convert partial number (SLI-12345)", () => {
    let given = `SLI-12345`;
    let result = extractOrderNumber(given);
    expect(result).toEqual(12345);
  });
  it("should convert non number (asdf) to 0", () => {
    let given = `asdf`;
    let result = extractOrderNumber(given);
    expect(result).toEqual(0);
  });
  it("should convert non number (null) to 0", () => {
    let given = null;
    let result = extractOrderNumber(given);
    expect(result).toEqual(0);
  });
});
