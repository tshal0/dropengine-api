import { UnprocessableEntityException } from '@nestjs/common';
import { IDomainEventProps } from '@shared/domain/events/BaseDomainEvents';
import { ResultError, Result } from '@shared/domain/Result';
import { UUID } from '@shared/domain/ValueObjects';
import { DbUser, DbUserStatus } from '@shared/modules/prisma/models/User';
import * as moment from 'moment';
import {
  UserEvent,
  UserSignedUp,
  UserActivated,
  UserDeactivated,
} from '../events/UserEvent';

export abstract class IUserStatus {
  static readonly ACTIVATED: string = `ACTIVATED`;
  static readonly DEACTIVATED: string = `DEACTIVATED`;
  static readonly DISABLED: string = `DISABLED`;
}

export interface IUser {
  id: string;
  externalUserId?: string | undefined;
  email: string;
  name: string;
  status: DbUserStatus;
  picture: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  events: IDomainEventProps[];
}
export interface UserProps {
  id: UUID;
  externalUserId?: string | undefined;
  email: string;
  name: string;
  status: DbUserStatus;
  picture: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  events: UserEvent[];
}

export class User {
  protected props: UserProps;
  private constructor(props: UserProps) {
    this.props = props;
  }
  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get name() {
    return this.props.name;
  }
  public static errorResult(error: any, value: any) {
    const err = new Error(error?.message || error);
    const resultError = new ResultError(err, [], value);
    const result = Result.fail<User>(resultError);
    return result;
  }
  public static init(id: UUID) {
    const now = moment().toDate();
    const defaultUserStatus = 'DEACTIVATED';
    const defaultPicture = '';
    const props: UserProps = {
      id: id,
      email: '',
      name: '',
      firstName: '',
      lastName: '',
      status: defaultUserStatus,
      picture: defaultPicture,
      createdAt: now,
      updatedAt: now,
      events: [],
    };
    return new User(props);
  }

  public static fromDb(prismaUser: DbUser): User {
    try {
      const id = UUID.from(prismaUser.id);
      const props: UserProps = {
        id: id,
        email: prismaUser.email,
        name: prismaUser.name,
        status: prismaUser.status,
        picture: prismaUser.picture,
        firstName: prismaUser.firstName,
        lastName: prismaUser.lastName,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
        events:
          prismaUser?.events?.map((e) => new UserEvent().fromDbEvent(e)) || [],
      };
      const user = new User(props);
      return user;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(`Unable To Load User From Db`);
    }
  }

  getProps(): IUser {
    const resp: IUser = {
      id: this.props.id.value,
      email: this.props.email,
      name: this.props.name,
      status: this.props.status,
      picture: this.props.picture,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      events: this.props.events?.map((e) => e.getProps()) || [],
    };
    return resp;
  }
  toUpsert() {
    const props = this.getProps();
    const resp = {
      ...props,
      events: this.props.events?.map((e) => e.toDbEvent()),
    };
    return resp;
  }

  signUp(event: UserSignedUp): User {
    this.props.externalUserId = event.details.externalUserId;
    this.props.picture = event.details.picture;
    this.props.email = event.details.email;
    this.props.firstName = event.details.firstName;
    this.props.lastName = event.details.lastName;
    this.props.status = 'ACTIVATED';
    let generatedName = `${this.props.firstName} ${this.props.lastName}`;
    generatedName = generatedName.trim();
    this.props.name = generatedName;
    this.raiseEvent(event);
    return this;
  }
  raiseEvent(event: UserEvent): User {
    this.props.events.push(event);
    return this;
  }
  updateEmail(email: string): User {
    this.props.email = email;
    return this;
  }
  updateAuth0UserId(id: string): User {
    this.props.externalUserId = id;
    return this;
  }
  updateName(name: string): User {
    this.props.name = name;
    return this;
  }
  updatePicture(picture: string): User {
    this.props.picture = picture;
    return this;
  }

  activate(event: UserActivated): User {
    this.props.status = 'ACTIVATED';
    this.raiseEvent(event);
    return this;
  }
  deactivate(event: UserDeactivated): User {
    this.props.status = 'DEACTIVATED';
    this.raiseEvent(event);
    return this;
  }

  disable(): User {
    this.props.status = 'DISABLED';
    return this;
  }
}
