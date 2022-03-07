import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { IUserProps } from "../interfaces";
@Entity({ tableName: "users" })
export class DbUser {
  @PrimaryKey()
  id!: string;

  @Property()
  externalUserId?: string | undefined;
  @Property()
  email: string;
  @Property()
  status: string;
  @Property({ nullable: true })
  picture?: string | undefined;
  @Property()
  firstName?: string | undefined;
  @Property()
  lastName: string;

  @Property()
  createdAt: Date;
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  props(maxDepth?: number | undefined): IUserProps {
    let props: IUserProps = {
      id: this.id,
      email: this.email,
      status: this.status,
      picture: this.picture,
      firstName: this.firstName,
      lastName: this.lastName,
      externalUserId: this.externalUserId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    return props;
  }
}
