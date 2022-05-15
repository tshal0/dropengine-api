import { IProductionData, ProductionData } from "./ProductionData";

describe("ProductionData", () => {
  const tested = "test";
  it("should exist", () => {
    const val = new ProductionData();
    const expected: IProductionData = {
      route: "1",
      material: "Mild Steel",
      thickness: "0.06",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("should take props", () => {
    const props = {
      route: "2",
      material: "Galv Steel",
      thickness: "0.12",
    };
    const val = new ProductionData(props);
    const expected: IProductionData = {
      route: "2",
      material: "Galv Steel",
      thickness: "0.12",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("route should be editable", () => {
    const val = new ProductionData();
    val.route = tested;
    const expected: IProductionData = {
      route: tested,
      material: "Mild Steel",
      thickness: "0.06",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("material should be editable", () => {
    const val = new ProductionData();
    val.material = tested;
    const expected: IProductionData = {
      material: tested,
      route: "1",
      thickness: "0.06",
    };
    expect(val.raw()).toEqual(expected);
  });
  it("thickness should be editable", () => {
    const val = new ProductionData();
    val.thickness = tested;
    const expected: IProductionData = {
      thickness: tested,
      route: "1",
      material: "Mild Steel",
    };
    expect(val.raw()).toEqual(expected);
  });
});
