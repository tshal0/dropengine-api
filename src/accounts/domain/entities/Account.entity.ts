import { Entity, Property, PrimaryKey, wrap } from "@mikro-orm/core";
import { IUser } from "../interfaces/IUser";
import { IAccountProps } from "../aggregates/Account";

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

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  props(maxDepth?: number | undefined): IAccountProps {
    let props: IAccountProps = {
      id: this.id,
      name: this.name,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      ownerId: this.ownerId,
      companyCode: this.companyCode,
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
      console.error(JSON.stringify(error, null, 2));
      throw error;
    }
  }
}
