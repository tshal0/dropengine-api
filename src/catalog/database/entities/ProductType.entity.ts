import {
  ILivePreview,
  IProductionData,
  IProductTypeProps,
  IVariantOptionsProps,
} from "@catalog/model";
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
  constructor(props?: IProductTypeProps | undefined) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.image = props.image;
      this.productionData = props.productionData;
      this.option1 = props.option1;
      this.option2 = props.option2;
      this.option3 = props.option3;
      this.livePreview = props.livePreview;
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

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
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

  public raw(): IProductTypeProps {
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
      products: [],
    };
    return props;
  }
}
