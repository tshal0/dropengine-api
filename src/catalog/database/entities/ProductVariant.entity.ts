import {
  IVariantOption,
  IVariantProps,
  Variant,
} from "@catalog/domain/model";
import { Entity, Property, PrimaryKey, ManyToOne, wrap } from "@mikro-orm/core";
import { IDimension, IWeight, IMoney } from "@shared/domain";
import { DbProduct } from "./Product.entity";
import { DbProductType } from "./ProductType.entity";

@Entity({ tableName: "product_variants" })
export class DbProductVariant {
  constructor(props?: IVariantProps | undefined) {
    if (props) {
      this.id = props.id;
      this.image = props.image;
      this.sku = props.sku;
      this.type = props.type;
      this.option1 = props.option1;
      this.option2 = props.option2;
      this.option3 = props.option3;
      this.height = props.height;
      this.width = props.width;
      this.weight = props.weight;
      this.manufacturingCost = props.manufacturingCost;
      this.shippingCost = props.shippingCost;
      
    }
  }
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @Property({ unique: true })
  sku: string;
  @Property()
  image: string;
  @Property({ default: "2DMetalArt" })
  type: string;

  @Property({ type: "json" })
  height: IDimension;
  @Property({ type: "json" })
  width: IDimension;
  @Property({ type: "json" })
  weight: IWeight;

  @Property({ type: "json" })
  option1: IVariantOption;
  @Property({ type: "json" })
  option2: IVariantOption;
  @Property({ type: "json" })
  option3: IVariantOption;

  // @Property({ type: "json" })
  // baseCost?: IMoney;
  // @Property({ type: "json" })
  // colorCost?: IMoney;
  @Property({ type: "json" })
  manufacturingCost: IMoney;
  @Property({ type: "json" })
  shippingCost: IMoney;
  // @Property({ type: "json" })
  // basePrice?: IMoney;
  // @Property({ type: "json" })
  // compareAtPrice?: IMoney;

  @ManyToOne(() => DbProduct)
  product: DbProduct;

  @ManyToOne(() => DbProductType)
  productType: DbProductType;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  public raw(): IVariantProps {
    const props: IVariantProps = {
      id: this.id,
      image: this.image,
      sku: this.sku,
      type: this.type,
      productId: this.product?.id,
      productTypeId: this.productType?.id,
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      height: this.height,
      width: this.width,
      weight: this.weight,
      manufacturingCost: this.manufacturingCost,
      shippingCost: this.shippingCost,
      product: this.product ? this.product.raw() : null,
      productType: this.productType ? this.productType.raw() : null,
    };
    return props;
  }
}
