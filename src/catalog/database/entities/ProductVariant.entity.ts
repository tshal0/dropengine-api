import {
  IDimension,
  IMoney,
  IVariantOption,
  IWeight,
  Variant,
} from "@catalog/domain/model";
import { Entity, Property, PrimaryKey, ManyToOne, wrap } from "@mikro-orm/core";
import { DbProduct } from "./Product.entity";

@Entity({ tableName: "product_variants" })
export class DbProductVariant {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @Property({ unique: true })
  sku: string;
  @Property()
  image: string;
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

  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  public props() {
    return new Variant(this);
  }
}
