import {
  IPersonalizationRule,
  IProductionData,
  IVariantOption,
  PersonalizationRule,
  ProductionData,
  VariantOption,
} from "@catalog/model";
import {
  Dimension,
  IDimension,
  IMoney,
  IWeight,
  Money,
  Weight,
} from "@shared/domain";
import validator from "validator";

export interface ISalesVariantProps {
  id: string;
  productId: string;
  productTypeId: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: IVariantOption;
  option2: IVariantOption;
  option3: IVariantOption;
  productionData: IProductionData;
  personalizationRules: IPersonalizationRule[];
  manufacturingCost: IMoney;
  shippingCost: IMoney;
  weight: IWeight;
  height: IDimension;
  width: IDimension;
}
export interface ISalesVariant {
  id: string;
  productId: string;
  productTypeId: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: VariantOption;
  option2: VariantOption;
  option3: VariantOption;
  productionData: ProductionData;
  personalizationRules: PersonalizationRule[];
  manufacturingCost: Money;
  shippingCost: Money;
  weight: Weight;
  height: Dimension;
  width: Dimension;
}

export class SalesVariant implements ISalesVariant {
  private _id: string = null;
  private _productId: string = null;
  private _productTypeId: string = null;
  private _sku: string = "";
  private _image: string = "";
  private _svg: string = "";
  private _type: string = "";
  private _option1: VariantOption = new VariantOption();
  private _option2: VariantOption = new VariantOption();
  private _option3: VariantOption = new VariantOption();
  private _productionData: ProductionData = new ProductionData();
  private _personalizationRules: PersonalizationRule[] = [];
  private _manufacturingCost: Money = new Money();
  private _shippingCost: Money = new Money();
  private _weight: Weight = new Weight();
  private _height: Dimension = new Dimension();
  private _width: Dimension = new Dimension();
  constructor(props?: ISalesVariantProps | undefined) {
    if (props) {
      this._id = validator.isUUID(`${props.id}`) ? props.id : null;
      this._productId = validator.isUUID(`${props.productId}`)
        ? props.productId
        : null;
      this._productTypeId = validator.isUUID(`${props.productTypeId}`)
        ? props.productTypeId
        : null;
      this._sku = props.sku;
      this._image = props.image;
      this._svg = props.svg;
      this._type = props.type;
      this._option1 = new VariantOption(props.option1);
      this._option2 = new VariantOption(props.option2);
      this._option3 = new VariantOption(props.option3);
      this._productionData = new ProductionData(props.productionData);
      this._personalizationRules = props.personalizationRules.map(
        (r) => new PersonalizationRule(r)
      );
      this._manufacturingCost = new Money(props.manufacturingCost);
      this._shippingCost = new Money(props.shippingCost);
      this._weight = new Weight(props.weight);
      this._height = new Dimension(props.height);
      this._width = new Dimension(props.width);
    }
  }

  public raw(): ISalesVariantProps {
    let props: ISalesVariantProps = {
      id: this._id,
      productId: this._productId,
      productTypeId: this._productTypeId,
      sku: this._sku,
      image: this._image,
      svg: this._svg,
      type: this._type,
      option1: this._option1.raw(),
      option2: this._option2.raw(),
      option3: this._option3.raw(),
      productionData: this._productionData.raw(),
      personalizationRules: this._personalizationRules.map((r) => r.raw()),
      manufacturingCost: this._manufacturingCost.raw(),
      shippingCost: this._shippingCost.raw(),
      weight: this._weight.raw(),
      height: this._height.raw(),
      width: this._width.raw(),
    };
    return props;
  }

  public set id(val: string) {
    if (validator.isUUID(`${val}`)) this._id = val;
  }
  public set image(val: string) {
    this._image = val;
  }
  public set sku(val: string) {
    this._sku = val;
  }
  public set type(val: string) {
    this._type = val;
  }
  public set productId(val: string) {
    if (validator.isUUID(`${val}`)) this._productId = val;
  }
  public set productTypeId(val: string) {
    if (validator.isUUID(`${val}`)) this._productTypeId = val;
  }
  public set option1(val: VariantOption) {
    this._option1 = new VariantOption(val);
  }
  public set option2(val: VariantOption) {
    this._option2 = new VariantOption(val);
  }
  public set option3(val: VariantOption) {
    this._option3 = new VariantOption(val);
  }
  public set height(val: Dimension) {
    this._height = new Dimension(val);
  }
  public set width(val: Dimension) {
    this._width = new Dimension(val);
  }
  public set weight(val: Weight) {
    this._weight = new Weight(val);
  }
  public set manufacturingCost(val: Money) {
    this._manufacturingCost = new Money(val);
  }
  public set shippingCost(val: Money) {
    this._shippingCost = new Money(val);
  }

  public set svg(val: any) {
    this._svg = val;
  }
  public get svg() {
    return this._svg;
  }
  public set productionData(val: any) {
    this._productionData = val;
  }
  public get productionData(): ProductionData {
    return this._productionData;
  }
  public set personalizationRules(val: any) {
    this._personalizationRules = val;
  }
  public get personalizationRules(): PersonalizationRule[] {
    return this._personalizationRules;
  }

  /** GETTERS */
  public get id() {
    return this._id;
  }
  public get image() {
    return this._image;
  }
  public get sku() {
    return this._sku;
  }
  public get type() {
    return this._type;
  }
  public get productId() {
    return this._productId;
  }
  public get productTypeId() {
    return this._productTypeId;
  }
  public get option1() {
    return this._option1;
  }
  public get option2() {
    return this._option2;
  }
  public get option3() {
    return this._option3;
  }
  public get height() {
    return this._height;
  }
  public get width() {
    return this._width;
  }
  public get weight() {
    return this._weight;
  }
  public get manufacturingCost() {
    return this._manufacturingCost;
  }
  public get shippingCost() {
    return this._shippingCost;
  }
}
