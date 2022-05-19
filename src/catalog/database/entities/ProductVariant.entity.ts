import {
  IDimension,
  IMoney,
  IVariantOption,
  IVariantProps,
  IWeight,
  Variant,
} from "@catalog/domain/model";
import { Entity, Property, PrimaryKey, ManyToOne, wrap } from "@mikro-orm/core";
import { DbProduct } from "./Product.entity";
import { DbProductType } from "./ProductType.entity";

@Entity({ tableName: "product_variants" })
export class DbProductVariant {
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

  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  public raw(
    pid?: string | undefined,
    ptid?: string | undefined
  ): IVariantProps {
    const props: IVariantProps = {
      id: this.id,
      image: this.image,
      sku: this.sku,
      type: this.type,
      productId: pid ?? this.product.id,
      productTypeId: ptid ?? this.productType.id,
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      height: this.height,
      width: this.width,
      weight: this.weight,
      manufacturingCost: this.manufacturingCost,
      shippingCost: this.shippingCost,
    };
    return props;
  }
  public entity() {
    return new Variant({
      ...this,
      productId: this.product.id,
      productTypeId: this.productType.id,
    });
  }
}
