import {
  IPersonalizationRule,
  PersonalizationRule,
} from "./PersonalizationRule";
import { IProductTypeProps, ProductType } from "./ProductType";
import { IVariantProps, Variant } from "./Variant";
import { trim } from "lodash";
import validator from "validator";
export interface IProductProps {
  id: number;
  sku: string;
  type: string;
  pricingTier: string;
  tags: string[];
  image: string;
  svg: string;
  personalizationRules: IPersonalizationRule[];
  variants: IVariantProps[];
  productType?: IProductTypeProps | undefined;
  createdAt: Date;
  updatedAt: Date;
}
export interface IProduct {
  id: number;
  sku: string;
  type: string;

  pricingTier: string;
  tags: string[];
  image: string;
  svg: string;
  personalizationRules: PersonalizationRule[];
  variants: Variant[];
  productType?: ProductType | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class Product implements IProduct {
  private _id: number = null;
  private _sku: string = "";
  private _type: string = "";
  private _pricingTier: string = "";
  private _image: string = "";
  private _svg: string = "";
  private _tags: string[] = [];
  private _personalizationRules: PersonalizationRule[] = [];
  private _variants: Variant[] = [];
  private _productType: ProductType = new ProductType();
  private _updatedAt: Date = new Date("2021-01-01T00:00:00.000Z");
  private _createdAt: Date = new Date("2021-01-01T00:00:00.000Z");
  constructor(props?: IProductProps | undefined) {
    if (props) {
      if (validator.isNumeric(`${props.id}`)) {
        this._id = props.id;
      }
      this._sku = props.sku;
      this._type = props.type;

      this._pricingTier = props.pricingTier;
      this._tags = props.tags?.map((t) => trim(t)) || [];
      this._image = props.image;
      this._svg = props.svg;
      this._personalizationRules = props.personalizationRules.map(
        (r) => new PersonalizationRule(r)
      );
      this._variants = props.variants.map((v) => new Variant(v));
      this._productType = props.productType
        ? new ProductType(props.productType)
        : new ProductType();
      this._updatedAt = props.updatedAt;
      this._createdAt = props.createdAt;
    }
  }

  public raw(): IProductProps {
    return {
      id: this._id,
      sku: this._sku,
      type: this._type,

      pricingTier: this._pricingTier,
      image: this._image,
      svg: this._svg,
      tags: this._tags,
      personalizationRules: this._personalizationRules.map((r) => r.raw()),
      variants: this._variants.map((v) => v.raw()),
      productType: this._productType.raw(),
      updatedAt: this._updatedAt,
      createdAt: this._createdAt,
    };
  }

  /** DOMAIN ACTIONS */

  /**
   * - ChangeImage, SVG
   * - Add/Remove/Update PersonalizationRule
   * - Add/Remove Variant
   */

  public set id(val: number) {
    if (validator.isNumeric(`${val}`)) this._id = val;
  }
  public set sku(val: string) {
    this._sku = val;
  }
  public set type(val: string) {
    this._type = val;
  }

  public set pricingTier(val: string) {
    this._pricingTier = val;
  }
  public set tags(val: string[]) {
    this._tags = val?.map((t) => trim(t)) || [];
  }
  public set image(val: string) {
    this._image = val;
  }
  public set svg(val: string) {
    this._svg = val;
  }
  public set personalizationRules(val: PersonalizationRule[]) {
    this._personalizationRules = val;
  }
  public set variants(val: Variant[]) {
    this._variants = val;
  }
  public set productType(val: ProductType) {
    this._productType = val;
  }
  public set updatedAt(val: Date) {
    this._updatedAt = val;
  }
  public set createdAt(val: Date) {
    this._createdAt = val;
  }

  public get id() {
    return this._id;
  }
  public get sku() {
    return this._sku;
  }
  public get type() {
    return this._type;
  }

  public get pricingTier() {
    return this._pricingTier;
  }
  public get tags() {
    return this._tags;
  }
  public get image() {
    return this._image;
  }
  public get svg() {
    return this._svg;
  }
  public get personalizationRules() {
    return this._personalizationRules;
  }
  public get variants() {
    return this._variants;
  }
  public get productType() {
    return this._productType;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
}
