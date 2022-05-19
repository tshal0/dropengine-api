import {
  IPersonalizationRule,
  IProductProps,
  IVariantProps,
  PersonalizationRule,
  Product,
  Variant,
} from "@catalog/domain/model";
import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  Collection,
  OneToMany,
  wrap,
  Cascade,
} from "@mikro-orm/core";
import { DbProductType } from "./ProductType.entity";
import { DbProductVariant } from "./ProductVariant.entity";

@Entity({ tableName: "products" })
export class DbProduct {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;
  @Property()
  type: string;
  @Property({ unique: true })
  sku: string;
  @Property()
  pricingTier: string;
  @Property({ type: "json" })
  tags: string[];
  // @Property({ type: "json" })
  // categories: string[];
  @Property()
  image?: string | undefined;
  @Property()
  svg?: string | undefined;
  @Property({ type: "json" })
  personalizationRules: IPersonalizationRule[];

  @OneToMany(() => DbProductVariant, (v) => v.product, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  variants = new Collection<DbProductVariant>(this);

  @ManyToOne(() => DbProductType)
  productType: DbProductType;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date;

  public raw(productTypeId?: string | undefined): IProductProps {
    const productId = this.id;
    const props: IProductProps = {
      id: productId,
      sku: this.sku,
      type: this.type,
      productTypeId: productTypeId,
      pricingTier: this.pricingTier,
      tags: this.tags,
      image: this.image,
      svg: this.svg,
      personalizationRules: this.personalizationRules,
      variants: this.variants.getItems().map((v) => {
        const vprops: IVariantProps = {
          id: v.id,
          image: v.image,
          sku: v.sku,
          type: v.type,
          productId: productId,
          productTypeId: productTypeId,
          option1: v.option1,
          option2: v.option2,
          option3: v.option3,
          height: v.height,
          width: v.width,
          weight: v.weight,
          manufacturingCost: v.manufacturingCost,
          shippingCost: v.shippingCost,
        };
        return vprops;
      }),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    return props;
  }
  public async entity() {
    if (!this.variants.isInitialized()) {
      await this.variants.init();
    }
    const dbVariants = await this.variants.loadItems();

    return new Product({
      id: this.id,
      sku: this.sku,
      type: this.type,
      productTypeId: this.productType.id,
      pricingTier: this.pricingTier,
      tags: this.tags,
      image: this.image,
      svg: this.svg,
      personalizationRules: this.personalizationRules.map(
        (r) => new PersonalizationRule(r)
      ),
      variants: dbVariants.map((v) => v.entity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
