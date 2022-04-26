import {
  Entity,
  Property,
  PrimaryKey,
  wrap,
  Cascade,
  Collection,
  OneToMany,
} from "@mikro-orm/core";
import { IAccountProps } from "../interfaces/IAccount";
import { IUser } from "../interfaces/IUser";
import { DbStore } from "./Store.entity";

@Entity({ tableName: "accounts" })
export class DbAccount {
  @PrimaryKey({ type: "uuid" })
  id: string;

  @Property()
  name: string;
  @Property()
  ownerId: string;
  @Property()
  companyCode: string;

  @OneToMany(() => DbStore, (v) => v.account, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  stores = new Collection<DbStore>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  /**
   * Returns props to be converted to DTOs.
   * @param maxDepth Max depth to expand nested properties.
   * @returns {IAccountProps}
   */
  props(maxDepth?: number | undefined): IAccountProps {
    let props: IAccountProps = {
      id: this.id,
      name: this.name,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      ownerId: this.ownerId,
      companyCode: this.companyCode,
      stores:
        this.stores && this.stores.isInitialized() && maxDepth > 0
          ? this.stores.getItems().map((v) => v.props(maxDepth - 1))
          : undefined,
    };
    return props;
  }
  /**
   * Copies props into specified `DbAccount` and returns `DbAccount`
   * @param props Properties to copy -> (e)
   * @param e Target `DbAccount`
   * @returns {DbAccount} Mutated `DbAccount`
   */
  public static copy(props: IAccountProps, e: DbAccount) {
    try {
      // Keep the original ID and createdAt values
      props.id = e.id;
      props.createdAt = e.createdAt;
      wrap(e).assign(props, { updateNestedEntities: true, mergeObjects: true });

      return e;
    } catch (error) {
      throw error;
    }
  }
}
