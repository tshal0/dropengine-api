import { Auth0Identity } from "../dto/Auth0Identity";
import { Auth0AppMetadata } from "../dto/Auth0AppMetadata";
import { User, UserSignedUp } from "@users/domain";

export interface IAuth0ExtendedUser {
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
  password: string;
}

export class Auth0ExtendedUser {
  protected readonly _props: IAuth0ExtendedUser;

  private constructor(props: IAuth0ExtendedUser) {
    this._props = props;
  }

  public static from(props: IAuth0ExtendedUser) {
    return new Auth0ExtendedUser(props);
  }

  public static fromUser(user: User) {
    const u = user.props();
    let props: IAuth0ExtendedUser = {
      app_metadata: {
        primary_user_id: u.id,
        authorization: { groups: [], permissions: [], roles: [] },
        companies: [],
        manufacturers: [],
        merchants: [],
        roles: [],
        sellers: [],
      },
      email: u.email,
      given_name: u.firstName,
      family_name: u.lastName,
      picture: u.picture,
      password: null,
    };
    return new Auth0ExtendedUser(props);
  }
  public static fromUserSignUp(event: UserSignedUp) {
    const u = event.props().details;

    let props: IAuth0ExtendedUser = {
      app_metadata: {
        primary_user_id: u.id,
        authorization: { groups: [], permissions: [], roles: [] },
        companies: [],
        manufacturers: [],
        merchants: [],
        roles: [],
        sellers: [],
      },
      email: u.email,
      given_name: u.firstName,
      family_name: u.lastName,
      name: u.name,
      picture: u.picture,
      password: null,
    };
    return new Auth0ExtendedUser(props);
  }
  public static init() {
    let props: IAuth0ExtendedUser = {
      app_metadata: {
        primary_user_id: null,
        authorization: { groups: [], permissions: [], roles: [] },
        companies: [],
        manufacturers: [],
        merchants: [],
        roles: [],
        sellers: [],
      },
      password: null,
    };
    return new Auth0ExtendedUser(props);
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

  addMerchant(code: string) {
    let lowered = code?.toLowerCase();
    this._props.app_metadata.companies =
      this._props.app_metadata.companies.filter((c) => !c.includes(lowered));
    this._props.app_metadata.merchants =
      this._props.app_metadata.merchants.filter((c) => !c.includes(lowered));
    this._props.app_metadata.companies.push(lowered);
    this._props.app_metadata.merchants.push(lowered);
    return this;
  }
  removeMerchant(code: string) {
    let lowered = code?.toLowerCase();
    this._props.app_metadata.companies =
      this._props.app_metadata.companies.filter((c) => !c.includes(lowered));
    this._props.app_metadata.merchants =
      this._props.app_metadata.merchants.filter((c) => !c.includes(lowered));
    return this;
  }
}
