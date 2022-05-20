import { Personalization } from "./Personalization";

describe("Personalization", () => {
  let pers: Personalization = null;
  it("should exist", () => {
    pers = new Personalization();
    const raw = pers.raw();
    const expected = { name: "", value: "" };
    expect(raw).toEqual(expected);
  });
  it("should take props", () => {
    pers = new Personalization({ name: "Name", value: "Sample" });
    const raw = pers.raw();
    const expected = { name: "Name", value: "Sample" };
    expect(raw).toEqual(expected);
  });
  it("should have editable name", () => {
    pers = new Personalization({ name: "Name", value: "Sample" });
    pers.name = "New";
    const raw = pers.raw();
    const expected = { name: "New", value: "Sample" };
    expect(raw).toEqual(expected);
  });
  it("should have editable email", () => {
    pers = new Personalization({ name: "Name", value: "Sample" });
    pers.value = "New";
    const raw = pers.raw();
    const expected = { name: "Name", value: "New" };
    expect(raw).toEqual(expected);
  });
});
