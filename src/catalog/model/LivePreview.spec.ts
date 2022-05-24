import { ILivePreview, LivePreview } from "./LivePreview";

describe("LivePreview", () => {
  it("should exist", () => {
    const val = new LivePreview();
    const expected: ILivePreview = {
      link: "",
      name: "",
      enabled: false,
      version: "",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("link should be editable", () => {
    const val = new LivePreview();
    val.link = "test";
    const expected: ILivePreview = {
      link: "test",
      name: "",
      enabled: false,
      version: "",
    };
    expect(val.raw()).toEqual(expected);
    expect(val.link).toEqual("test");
  });
  it("name should be editable", () => {
    const val = new LivePreview();
    val.name = "test";
    const expected: ILivePreview = {
      link: "",
      name: "test",
      enabled: false,
      version: "",
    };
    expect(val.name).toEqual("test");
    expect(val.raw()).toEqual(expected);
  });
  it("enabled should be editable", () => {
    const val = new LivePreview();
    val.enabled = true;
    const expected: ILivePreview = {
      link: "",
      name: "",
      enabled: true,
      version: "",
    };
    expect(val.enabled).toEqual(true);
    expect(val.raw()).toEqual(expected);
  });
  it("version should be editable", () => {
    const val = new LivePreview();
    val.version = "test";
    const expected: ILivePreview = {
      link: "",
      name: "",
      enabled: false,
      version: "test",
    };
    expect(val.version).toEqual("test");
    expect(val.raw()).toEqual(expected);
  });
});
