import { Dimension, IDimension } from "./Dimension";
import { IMoney, Money } from "./Money";
import { IProductProps, Product } from "./Product";
import { IProductTypeProps, ProductType } from "./ProductType";
import { IVariantOption, VariantOption } from "./VariantOption";
import { IWeight, Weight } from "./Weight";

export interface IVariantProps {
  id: string;
  image: string;
  sku: string;
  type: string;
  productId: string;
  productTypeId: string;
  option1: IVariantOption;
  option2: IVariantOption;
  option3: IVariantOption;
  height: IDimension;
  width: IDimension;
  weight: IWeight;
  manufacturingCost: IMoney;
  shippingCost: IMoney;
  product?: IProductProps | undefined;
  productType?: IProductTypeProps | undefined;
}

export interface IVariant {
  id: string;
  image: string;
  sku: string;
  type: string;
  productId: string;
  productTypeId: string;
  option1: VariantOption;
  option2: VariantOption;
  option3: VariantOption;
  height: Dimension;
  width: Dimension;
  weight: Weight;
  manufacturingCost: Money;
  shippingCost: Money;

  product?: Product | undefined;
  productType?: ProductType | undefined;
}

export class Variant implements IVariant {
  private _id: string = "";
  private _image: string = "";
  private _sku: string = "";
  private _type: string = "";
  private _productId: string = "";
  private _productTypeId: string = "";
  private _product: Product = new Product();
  private _productType: ProductType = new ProductType();
  private _option1: VariantOption = new VariantOption();
  private _option2: VariantOption = new VariantOption();
  private _option3: VariantOption = new VariantOption();
  private _height: Dimension = new Dimension();
  private _width: Dimension = new Dimension();
  private _weight: Weight = new Weight();
  private _manufacturingCost: Money = new Money();
  private _shippingCost: Money = new Money();
  constructor(props?: IVariantProps | undefined) {
    if (props) {
      this._id = props.id;
      this._image = props.image;
      this._sku = props.sku;
      this._type = props.type;
      this._productId = props.productId;
      this._productTypeId = props.productTypeId;
      this._option1 = new VariantOption(props.option1);
      this._option2 = new VariantOption(props.option2);
      this._option3 = new VariantOption(props.option3);
      this._height = new Dimension(props.height);
      this._width = new Dimension(props.width);
      this._weight = new Weight(props.weight);
      this._manufacturingCost = new Money(props.manufacturingCost);
      this._shippingCost = new Money(props.shippingCost);
      this._product = props.product
        ? new Product(props.product)
        : new Product();
      this._productType = props.productType
        ? new ProductType(props.productType)
        : new ProductType();
    }
  }
  public raw(): IVariantProps {
    return {
      id: this._id,
      image: this._image,
      sku: this._sku,
      type: this._type,
      productId: this._productId,
      productTypeId: this._productTypeId,
      option1: this._option1.raw(),
      option2: this._option2.raw(),
      option3: this._option3.raw(),
      height: this._height.raw(),
      width: this._width.raw(),
      weight: this._weight.raw(),
      manufacturingCost: this._manufacturingCost.raw(),
      shippingCost: this._shippingCost.raw(),
      product: this._product.raw(),
      productType: this._productType.raw(),
    };
  }

  /** DOMAIN ACTIONS */
  /**
   * - Get ProductionData, PersonalizationRules, ProductType, BaseSVG, Image
   * - Update Variant (Must obey ProductType VariantOption rules)
   */

  public set id(val: string) {
    this._id = val;
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
    this._productId = val;
  }
  public set productTypeId(val: string) {
    this._productTypeId = val;
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
  public set product(val: Product) {
    this._product = val;
  }
  public set productType(val: ProductType) {
    this._productType = val;
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
  public get product() {
    return this._product;
  }
  public get productType() {
    return this._productType;
  }
}
