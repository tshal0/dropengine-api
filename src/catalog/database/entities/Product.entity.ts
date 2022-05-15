import {
  IPersonalizationRule,
  IProductProps,
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
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  public async toProduct() {
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
      variants: dbVariants.map((v) => v.props()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
