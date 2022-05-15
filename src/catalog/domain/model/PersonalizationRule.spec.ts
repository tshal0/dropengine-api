import {
  IPersonalizationRule,
  PersonalizationRule,
} from "./PersonalizationRule";

describe("PersonalizationRule", () => {
  it("should exist", () => {
    const val = new PersonalizationRule();
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("name should be editable", () => {
    const val = new PersonalizationRule();
    val.name = "test";
    const expected: IPersonalizationRule = {
      name: "test",
      type: "",
      label: "",
      options: "",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("type should be editable", () => {
    const val = new PersonalizationRule();
    val.type = "test";
    const expected: IPersonalizationRule = {
      name: "",
      type: "test",
      label: "",
      options: "",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("label should be editable", () => {
    const val = new PersonalizationRule();
    val.label = "test";
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "test",
      options: "",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("options should be editable", () => {
    const val = new PersonalizationRule();
    val.options = "A,B";
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "A,B",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("pattern should be editable", () => {
    const val = new PersonalizationRule();
    val.pattern = "^[a-zA-Z0-9\\s.,'/&]*";
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.,'/&]*",
      required: false,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("required should be editable", () => {
    const val = new PersonalizationRule();
    val.required = true;
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "",
      required: true,
      maxLength: 0,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("maxLength should be editable", () => {
    const val = new PersonalizationRule();
    val.maxLength = 22;
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "",
      required: false,
      maxLength: 22,
      placeholder: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("placeholder should be editable", () => {
    const val = new PersonalizationRule();
    val.placeholder = "Enter Up to 16 Characters";
    const expected: IPersonalizationRule = {
      name: "",
      type: "",
      label: "",
      options: "",
      pattern: "",
      required: false,
      maxLength: 0,
      placeholder: "Enter Up to 16 Characters",
    };
    expect(val.raw()).toEqual(expected);
  });
});
