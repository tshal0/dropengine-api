import {
  ILivePreview,
  IProductionData,
  IProductTypeProps,
  IVariantOptionsProps,
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

  public async toProductType() {
    if (!this.products.isInitialized()) {
      await this.products.init();
    }
    const dbProducts = await this.products.loadItems();
    const dbProductTasks = await dbProducts.map(async (p) => p.toProduct());
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
}
