export const defaultProductionData: IProductionData = {
  route: "1",
  material: "Mild Steel",
  thickness: "0.06",
};
export interface IProductionData {
  route: string;
  material: string;
  thickness: string;
}
export class ProductionData implements IProductionData {
  private _route: string = defaultProductionData.route;
  private _material: string = defaultProductionData.material;
  private _thickness: string = defaultProductionData.thickness;

  constructor(props?: IProductionData | undefined) {
    if (props) {
      this.route = props.route;
      this.material = props.material;
      this.thickness = props.thickness;
    }
  }

  raw(): IProductionData {
    return {
      material: this._material,
      route: this._route,
      thickness: this._thickness,
    };
  }

  public set route(val: any) {
    this._route = val;
  }
  public set material(val: any) {
    this._material = val;
  }
  public set thickness(val: any) {
    this._thickness = val;
  }

  public get route() {
    return this._route;
  }
  public get material() {
    return this._material;
  }
  public get thickness() {
    return this._thickness;
  }
}
