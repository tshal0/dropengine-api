import { NotImplementedException } from "@nestjs/common";
import {
  IAggregate,
  IDomainEventProps,
  Result,
  ResultError,
  UUID,
} from "@shared/domain";
import {
  CreateAuth0UserDto,
  CreateAuth0UserResponseDto,
  CreateUserDto,
  IAuth0ExtendedUser,
} from "@users/dto/CreateUserDto";
import { cloneDeep } from "lodash";
import { DbUser } from "../entities/User.entity";
import { IUser, IUserProps } from "../interfaces";
import moment from "moment";
export enum UserError {
  InvalidUser = "InvalidUser",
}

export class InvalidUser implements ResultError {
  public stack: string;
  public name = UserError.InvalidUser;
  public message: string;
  constructor(public inner: ResultError[], public value: any, reason: string) {
    this.message = `${this.name} '${value.email}': ${reason}`;
  }
}
export class User extends IAggregate<IUser, DbUser, IUserProps> {
  protected _events: IDomainEventProps[];
  protected constructor(val: IUser, dbe: DbUser) {
    super(val, dbe);
  }
  get id() {
    return this._props.id.value();
  }
  get email() {
    return this._props.email;
  }
  get name() {
    return `${this._props.firstName || ""} ${
      this._props.lastName || ""
    }`.trim();
  }
  /**
   * Get the value object of the Product
   * @returns Product
   */
  public value(): IUser {
    const props: IUser = cloneDeep(this._props);
    return Object.seal(props);
  }

  /**
   * Returns the raw props.
   * @returns {DbUser}
   */
  public entity(): DbUser {
    const entity: DbUser = this._entity;

    return Object.seal(entity);
  }
  /**
   * Returns the raw props.
   * @returns {DbUser}
   */
  public props(): IUserProps {
    const entity: DbUser = this._entity;
    return Object.seal(entity.props());
  }
  /** Domain Actions */

  setEmail(value: string) {
    this._props.email = value;
    this._entity.email = value;
    return this;
  }
  setFirstName(value: string) {
    this._props.firstName = value;
    this._entity.firstName = value;
    return this;
  }
  setLastName(value: string) {
    this._props.lastName = value;
    this._entity.lastName = value;
    return this;
  }
  setExternalUserId(value: string) {
    this._props.externalUserId = value;
    this._entity.externalUserId = value;
    return this;
  }

  setPicture(picture: string): User {
    this._props.picture = picture;
    this._entity.picture = picture;
    return this;
  }

  applyAuth0Response(dto: CreateAuth0UserResponseDto): Result<User> {
    this.setExternalUserId(`auth0|${dto._id}`)
      .setEmail(dto.email)
      .setPicture(dto.picture)
      .setFirstName(dto.given_name)
      .setLastName(dto.family_name)
      .activate();

    return Result.ok(this);
  }
  applyAuth0User(dto: IAuth0ExtendedUser): Result<User> {
    this.setExternalUserId(`${dto.user_id}`)
      .setEmail(dto.email)
      .setPicture(dto.picture)
      .setFirstName(dto.given_name)
      .setLastName(dto.family_name)
      .activate();

    return Result.ok(this);
  }

  activate(): User {
    this._props.status = "ACTIVATED";
    this._entity.status = "ACTIVATED";
    return this;
  }
  deactivate(): User {
    this._props.status = "DEACTIVATED";
    this._entity.status = "DEACTIVATED";
    return this;
  }

  disable(): User {
    this._props.status = "DISABLED";
    this._entity.status = "DISABLED";
    return this;
  }
  setPending() {
    this._props.status = "PENDING";
    this._entity.status = "PENDING";
    return this;
  }
  raiseEvent(event: any): User {
    return this;
  }

  generateAuth0CreateUserPayload(
    dto: CreateUserDto,
    clientId: string,
    connection: string
  ): CreateAuth0UserDto {
    //TODO: Add generator method to CreateAuth0UserDto class
    let auth0Dto: CreateAuth0UserDto = {
      client_id: clientId,
      email: this._props.email,
      password: dto.password,
      connection: connection,
    };
    return auth0Dto;
  }

  /** Utility Methods */

  public static create(dto: CreateUserDto): Result<User> {
    const now = moment().toDate();
    let results: { [key: string]: Result<any> } = {};
    results.id = dto.id ? UUID.from(dto.id) : User.generateUuid();

    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidUser(
          errors,
          { ...dto },
          `Failed to generate User. See inner error for details.`
        )
      );
    }
    const props: IUser = {
      id: results.id.value(),
      email: dto.email,
      status: "DEACTIVATED", //TODO: ValueObject for UserStatus
      picture: dto.picture,
      firstName: dto.firstName,
      lastName: dto.lastName,
      createdAt: now,
      updatedAt: now,
    };
    const dbe: DbUser = new DbUser();
    dbe.id = props.id.value();
    dbe.email = props.email;
    dbe.firstName = props.firstName;
    dbe.lastName = props.lastName;
    dbe.picture = props.picture;

    dbe.createdAt = props.createdAt;
    dbe.updatedAt = props.updatedAt;
    dbe.status = props.status;
    const user = new User(props, dbe);
    return Result.ok(user);
  }

  public static db(dbe: DbUser): Result<User> {
    let results: { [key: string]: Result<any> } = {
      id: UUID.from(dbe.id),
    };
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      return Result.fail(
        new InvalidUser(
          errors,
          { ...dbe },
          `Failed to generate User. See inner error for details.`
        )
      );
    }
    const props: IUser = {
      id: results.id.value(),
      email: dbe.email,
      status: dbe.status,
      picture: dbe.picture,
      firstName: dbe.firstName,
      lastName: dbe.lastName,
      externalUserId: dbe.externalUserId,

      createdAt: dbe.createdAt,
      updatedAt: dbe.updatedAt,
    };
    const user = new User(props, dbe);
    return Result.ok(user);
  }
  public static generateUuid() {
    return UUID.from(UUID.generate().value());
  }
}
