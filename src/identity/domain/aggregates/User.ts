import { IAuth0User } from "@auth0/domain/Auth0ExtendedUser";
import { IUser, IUserAccount } from "../interfaces/IUser";
import { Account } from "./Account";

export class User {
  protected readonly _props: IUser;

  private constructor(props: IUser) {
    this._props = props;
  }

  public static from(props: IUser) {
    return new User(props);
  }
  public props() {
    return this._props;
  }

  /** DOMAIN METHODS */
  public addOwnedAccount(val: Account) {
    const account = val.props();
    this._props.metadata.accounts = this._props.metadata.accounts.filter(
      (a) => a.id != account.id
    );
    const userAccount: IUserAccount = {
      id: account.id,
      companyCode: account.companyCode,
      name: account.name,
      roles: ["owner"],
      permissions: [
        "manage:account",
        "manage:orders",
        "manage:products",
        "manage:stores",
        "read:account",
        "read:orders",
        "read:products",
        "read:stores",
      ],
    };
    let existingAcct = this._props.metadata.accounts.find(
      (a) => a.id == account.id
    );
    if (!existingAcct) {
      this._props.metadata.accounts.push(userAccount);
    } else {
      existingAcct = userAccount;
    }
    return this;
  }
  public addAccount(val: Account) {
    const account = val.props();
    this._props.metadata.accounts = this._props.metadata.accounts.filter(
      (a) => a.id != account.id
    );
    const userAccount: IUserAccount = {
      id: account.id,
      companyCode: account.companyCode,
      name: account.name,
      roles: ["member"],
      permissions: [
        "read:account",
        "read:orders",
        "read:products",
        "read:stores",
      ],
    };
    let existingAcct = this._props.metadata.accounts.find(
      (a) => a.id == account.id
    );
    if (!existingAcct) {
      this._props.metadata.accounts.push(userAccount);
    }
    return this;
  }
  public removeAccount(val: Account) {
    const account = val.props();

    this._props.metadata.accounts = this._props.metadata.accounts.filter(
      (a) => a.id != account.id
    );
    return this;
  }
  public removeAllAccounts() {
    this._props.metadata.accounts = [];
    return this;
  }

  /** UTILITY METHODS */

  public static fromAuth0User(auth0User: IAuth0User) {
    const accounts = auth0User.app_metadata?.accounts || [];
    let props: IUser = {
      email: auth0User.email,
      emailVerified: auth0User.email_verified,
      name: auth0User.name,
      firstName: auth0User.given_name,
      lastName: auth0User.family_name,
      picture: auth0User.picture,
      locale: auth0User.locale,
      updatedAt: auth0User.updated_at,
      id: auth0User.user_id,
      nickname: auth0User.nickname,
      createdAt: auth0User.created_at,
      metadata: {
        authorization: {
          ...auth0User.app_metadata?.authorization,
        },
        accounts: [...accounts],
      },
      lastIp: auth0User.last_ip,
      lastLogin: auth0User.last_login,
      loginsCount: auth0User.logins_count,
    };
    return new User(props);
  }

  /** MAPPER METHODS */
  public toAuth0(): IAuth0User {
    let auth0User: IAuth0User = {
      user_id: this._props.id,
      email: this._props.email,
      given_name: this._props.firstName,
      family_name: this._props.lastName,
      picture: this._props.picture,
      email_verified: this._props.emailVerified,
      name: this._props.name,
      locale: this._props.locale,

      nickname: this._props.nickname,

      app_metadata: {
        accounts: [...this._props.metadata.accounts],
        authorization: { ...this._props.metadata.authorization },
      },
      last_ip: this._props.lastIp,
      last_login: this._props.lastLogin,
      logins_count: this._props.loginsCount,

      created_at: this._props.createdAt,
      updated_at: this._props.updatedAt,
    };
    return auth0User;
  }
}
