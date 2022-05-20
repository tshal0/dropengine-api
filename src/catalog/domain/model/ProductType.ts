import { IProduct, IProductProps, Product } from "./Product";
import { IProductionData, ProductionData } from "./ProductionData";
import { ILivePreview, LivePreview } from "./LivePreview";
import { IVariantOptionsProps, VariantOptions } from "./VariantOptions";

export enum ProductTypes {
  Steel = "Steel",
  MetalArt = "MetalArt",
  Jewelry = "Jewelry",
  Wood = "Wood",
  Canvas = "Canvas",
  Uncategorized = "Uncategorized",
}

export interface IProductTypeProps {
  id: string;
  name: string;
  image: string;
  productionData: IProductionData;
  option1: IVariantOptionsProps;
  option2: IVariantOptionsProps;
  option3: IVariantOptionsProps;
  livePreview: ILivePreview;
  products: IProductProps[];
  updatedAt: Date;
  createdAt: Date;
}
export interface IProductType {
  id: string;
  name: string;
  image: string;
  productionData: ProductionData;
  option1: VariantOptions;
  option2: VariantOptions;
  option3: VariantOptions;
  livePreview: LivePreview;
  products: Product[];
  updatedAt: Date;
  createdAt: Date;
}

/**
 * {ProductType}
 * Holds ProductionData, VariantOptions, LivePreview, Products
 */
export class ProductType implements IProductType {
  private _id: string = "";
  private _name: string = "";
  private _image: string = "";
  private _productionData: ProductionData = new ProductionData();
  private _option1: VariantOptions = new VariantOptions();
  private _option2: VariantOptions = new VariantOptions();
  private _option3: VariantOptions = new VariantOptions();
  private _livePreview: LivePreview = new LivePreview();
  private _products: Product[] = [];
  private _updatedAt: Date = new Date("2021-01-01T00:00:00.000Z");
  private _createdAt: Date = new Date("2021-01-01T00:00:00.000Z");

  constructor(props?: IProductTypeProps | undefined) {
    if (props) {
      this._id = props.id;
      this._name = props.name;
      this._image = props.image;
      this._productionData = new ProductionData(props.productionData);
      this._option1 = new VariantOptions(props.option1);
      this._option2 = new VariantOptions(props.option2);
      this._option3 = new VariantOptions(props.option3);
      this._livePreview = new LivePreview(props.livePreview);
      this._products = props.products.map((p) => new Product(p));
      this._updatedAt = props.updatedAt;
      this._createdAt = props.createdAt;
    }
  }

  public raw(): IProductTypeProps {
    return {
      id: this._id,
      name: this._name,
      image: this._image,
      productionData: this._productionData.raw(),
      option1: this._option1.raw(),
      option2: this._option2.raw(),
      option3: this._option3.raw(),
      livePreview: this._livePreview.raw(),
      products: this._products.map((p) => p.raw()),
      updatedAt: this._updatedAt,
      createdAt: this._createdAt,
    };
  }

  /** DOMAIN METHODS */

  /** SETTERS */
  public set id(val: string) {
    this._id = val;
  }
  public set name(val: string) {
    this._name = val;
  }
  public set image(val: string) {
    this._image = val;
  }
  public set productionData(val: ProductionData) {
    this._productionData = val;
  }
  public set option1(val: VariantOptions) {
    this._option1 = val;
  }
  public set option2(val: VariantOptions) {
    this._option2 = val;
  }
  public set option3(val: VariantOptions) {
    this._option3 = val;
  }
  public set livePreview(val: LivePreview) {
    this._livePreview = val;
  }
  public set products(val: Product[]) {
    this._products = val;
  }
  public set updatedAt(val: Date) {
    this._updatedAt = val;
  }
  public set createdAt(val: Date) {
    this._createdAt = val;
  }

  /** GETTERS */
  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get image() {
    return this._image;
  }
  public get productionData(): ProductionData {
    return this._productionData;
  }
  public get option1(): VariantOptions {
    return this._option1;
  }
  public get option2(): VariantOptions {
    return this._option2;
  }
  public get option3(): VariantOptions {
    return this._option3;
  }
  public get livePreview(): LivePreview {
    return this._livePreview;
  }
  public get products(): Product[] {
    return this._products;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
}
