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
  constructor(props?: IProductProps | undefined) {
    if (props) {
      this.id = props.id;
      this.sku = props.sku;
      this.type = props.type;
      this.pricingTier = props.pricingTier;
      this.tags = props.tags;
      this.image = props.image;
      this.svg = props.svg;
      this.personalizationRules = props.personalizationRules;
      this.updatedAt = props.updatedAt;
      this.createdAt = props.createdAt;
    }
  }
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
  createdAt: Date = new Date();
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  public raw(): IProductProps {
    const productId = this.id;
    const rules = this.personalizationRules
      ? this.personalizationRules.map((r) => new PersonalizationRule(r).raw())
      : [];
    const productType = this.productType ? this.productType.raw() : null;
    const productTypeId = productType ? productType.id : null;
    const props: IProductProps = {
      id: productId,
      sku: this.sku,
      type: this.type,
      productTypeId: productTypeId,
      pricingTier: this.pricingTier,
      tags: this.tags,
      image: this.image,
      svg: this.svg,
      personalizationRules: rules,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      variants: [],
      productType: productType,
    };
    return props;
  }
}
