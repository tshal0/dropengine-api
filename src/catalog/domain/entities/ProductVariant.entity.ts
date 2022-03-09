import { Entity, Property, PrimaryKey, ManyToOne, wrap } from "@mikro-orm/core";
import { IDimension, IMoney, IWeight } from "@shared/domain";
import { IVariantOption, IProductVariantProps } from "..";
import { DbProduct } from "./Product.entity";

@Entity({ tableName: "product_variants" })
export class DbProductVariant {
  @PrimaryKey()
  uuid!: string;

  @Property()
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
  option1?: IVariantOption;
  @Property({ type: "json" })
  option2?: IVariantOption;
  @Property({ type: "json" })
  option3?: IVariantOption;

  // @Property({ type: "json" })
  // baseCost?: IMoney;
  // @Property({ type: "json" })
  // colorCost?: IMoney;
  @Property({ type: "json" })
  manufacturingCost?: IMoney;
  @Property({ type: "json" })
  shippingCost?: IMoney;
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

  public props(maxDepth?: number | undefined): IProductVariantProps {
    const props: IProductVariantProps = {
      uuid: this.uuid,
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      image: this.image,
      sku: this.sku,
      height: this.height,
      width: this.width,
      weight: this.weight,
      manufacturingCost: this.manufacturingCost,
      shippingCost: this.shippingCost,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      product:
        this.product && maxDepth && maxDepth > 0 ? this.product.props() : null,
    };

    return props;
  }

  /**
   * Copies props into specified `DbProductVariant` and returns `DbProductVariant`
   * @param source Properties to copy -> (e)
   * @param target Target `DbProductVariant`
   * @returns {DbProductVariant} Mutated `DbProductVariant`
   */
  public static copy(source: DbProductVariant, target: DbProductVariant) {
    try {
      source.uuid = target.uuid;
      source.createdAt = target.createdAt;
      wrap(target).assign(source, { merge: true, mergeObjects: true });
      return target;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
