import {
  Entity,
  Property,
  ManyToOne,
  IdentifiedReference,
  ManyToMany,
  PrimaryKey,
  UuidType,
  SerializedPrimaryKey,
  Collection,
  OneToMany,
  Cascade,
} from "@mikro-orm/core";
import { UUID } from "@shared/domain";
import {
  IProductTypeProductionData,
  IProductTypeOption,
  IProductTypeLivePreview,
} from "..";
import { IProductTypeProps } from "../interfaces";
import { DbProduct } from "./Product.entity";

@Entity({ tableName: "product_types" })
export class DbProductType {
  @PrimaryKey({ type: "uuid", defaultRaw: "uuid_generate_v4()" })
  id!: string;

  @Property()
  name: string;
  @Property({ nullable: true })
  image?: string | undefined;
  @Property({ type: "json" })
  productionData: IProductTypeProductionData;
  @Property({ type: "json", nullable: true })
  option1: IProductTypeOption;
  @Property({ type: "json", nullable: true })
  option2: IProductTypeOption;
  @Property({ type: "json", nullable: true })
  option3: IProductTypeOption;
  @Property({ type: "json" })
  livePreview: IProductTypeLivePreview;

  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => DbProduct, (v) => v.productType, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  products = new Collection<DbProduct>(this);

  props(maxDepth?: number | undefined): IProductTypeProps {
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
      products:
        this.products && this.products.isInitialized() && maxDepth > 0
          ? this.products.getItems().map((v) => v.props(maxDepth - 1))
          : null,
    };
    return props;
  }
}
