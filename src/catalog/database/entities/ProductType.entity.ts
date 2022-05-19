import {
  ILivePreview,
  IProductionData,
  IProductProps,
  IProductTypeProps,
  IVariantOptionsProps,
  IVariantProps,
  ProductType,
} from "@catalog/domain/model";
import {
  Entity,
  Property,
  PrimaryKey,
  Collection,
  OneToMany,
  Cascade,
} from "@mikro-orm/core";

import { DbProduct } from "./Product.entity";
import { DbProductVariant } from "./ProductVariant.entity";

@Entity({ tableName: "product_types" })
export class DbProductType {
  constructor(props?: DbProductType | undefined) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.image = props.image;
      this.productionData = props.productionData;
      this.option1 = props.option1;
      this.option2 = props.option2;
      this.option3 = props.option3;
      this.livePreview = props.livePreview;
      this.products = props.products;
      this.updatedAt = props.updatedAt;
      this.createdAt = props.createdAt;
    }
  }

  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @Property()
  name: string;
  @Property({ nullable: true })
  image?: string | undefined;
  @Property({ type: "json" })
  productionData: IProductionData;
  @Property({ type: "json", nullable: true })
  option1: IVariantOptionsProps;
  @Property({ type: "json", nullable: true })
  option2: IVariantOptionsProps;
  @Property({ type: "json", nullable: true })
  option3: IVariantOptionsProps;
  @Property({ type: "json" })
  livePreview: ILivePreview;

  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => DbProduct, (v) => v.productType, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  products = new Collection<DbProduct>(this);

  @OneToMany(() => DbProductVariant, (v) => v.productType, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  variants = new Collection<DbProductVariant>(this);

  public async entity() {
    if (!this.products.isInitialized()) {
      await this.products.init();
    }
    const dbProducts = await this.products.loadItems();
    const dbProductTasks = await dbProducts.map(async (p) => p.entity());
    const products = await Promise.all(dbProductTasks);
    return new ProductType({
      id: this.id,
      name: this.name,
      image: this.image,
      productionData: this.productionData,
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      livePreview: this.livePreview,
      products: products,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    });
  }
  public raw(): IProductTypeProps {
    const productTypeId = this.id;
    let props: IProductTypeProps = {
      id: this.id,
      name: this.name,
      image: this.image,
      productionData: this.productionData,
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      livePreview: this.livePreview,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      products: this.products.getItems().map((p) => {
        const productId = p.id;
        const pprops: IProductProps = {
          id: p.id,
          sku: p.sku,
          type: p.type,
          productTypeId: productTypeId,
          pricingTier: p.pricingTier,
          tags: p.tags,
          image: p.image,
          svg: p.svg,
          personalizationRules: p.personalizationRules,
          variants: p.variants.getItems().map((v) => {
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
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
        return pprops;
      }),
    };
    return props;
  }
}
