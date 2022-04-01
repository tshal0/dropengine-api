import { Auth0Identity } from "../dto/Auth0Identity";
import { Auth0AppMetadata } from "../dto/Auth0AppMetadata";
import { CreateUserDto } from "src/accounts/dto/CreateUserDto";

export interface IAuth0User {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  updated_at?: Date;
  user_id?: string;
  nickname?: string;
  identities?: Auth0Identity[];
  created_at?: Date;
  app_metadata?: Auth0AppMetadata;
  last_ip?: string;
  last_login?: Date;
  logins_count?: number;
  password?: string;
}

export class Auth0User {
  protected readonly _props: IAuth0User;

  private constructor(props: IAuth0User) {
    this._props = props;
  }

  public static from(props: IAuth0User) {
    return new Auth0User(props);
  }
  public static create(dto: CreateUserDto) {
    let props: IAuth0User = {
      password: dto.password,
      email: dto.email,
      family_name: dto.lastName,
      given_name: dto.firstName,
      app_metadata: {
        authorization: {},
        accounts: [],
        roles: [],
      },
    };
    return new Auth0User(props);
  }

  public static init() {
    let props: IAuth0User = {
      app_metadata: {
        authorization: { groups: [], permissions: [], roles: [] },
        accounts: [],
      },
      password: null,
    };
    return new Auth0User(props);
  }

  public props() {
    return this._props;
  }

  public get email() {
    return this._props.email;
  }
  public get email_verified() {
    return this._props.email_verified;
  }
  public get name() {
    return this._props.name;
  }
  public get given_name() {
    return this._props.given_name;
  }
  public get family_name() {
    return this._props.family_name;
  }
  public get picture() {
    return this._props.picture;
  }
  public get locale() {
    return this._props.locale;
  }
  public get updated_at() {
    return this._props.updated_at;
  }
  public get user_id() {
    return this._props.user_id;
  }
  public get nickname() {
    return this._props.nickname;
  }
  public get identities() {
    return this._props.identities;
  }
  public get created_at() {
    return this._props.created_at;
  }
  public get app_metadata() {
    return this._props.app_metadata;
  }
  public get last_ip() {
    return this._props.last_ip;
  }
  public get last_login() {
    return this._props.last_login;
  }
  public get logins_count() {
    return this._props.logins_count;
  }
  public get password() {
    return this._props.password;
  }
}
