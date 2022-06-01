import { Entity, Property, PrimaryKey, wrap, ManyToOne } from "@mikro-orm/core";
import { IStoreProps } from "../interfaces/IStore";
import { IUser } from "../interfaces/IUser";
import { DbAccount } from "./Account.entity";

@Entity({ tableName: "stores" })
export class DbStore {
  @PrimaryKey({ type: "uuid" })
  id: string;

  @Property()
  name: string;

  @ManyToOne(() => DbAccount)
  account: DbAccount;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  props(maxDepth?: number | undefined): IStoreProps {
    let props: IStoreProps = {
      id: this.id,
      name: this.name,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      account: maxDepth ? this.account.props(maxDepth - 1) : undefined,
    };
    return props;
  }
  /**
   * Copies props into specified `DbStore` and returns `DbStore`
   * @param props Properties to copy -> (e)
   * @param e Target `DbStore`
   * @returns {DbStore} Mutated `DbStore`
   */
  public static copy(props: IStoreProps, e: DbStore) {
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
