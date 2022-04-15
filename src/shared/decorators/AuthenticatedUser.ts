import { IUserAccount, IUserMetadata } from "@accounts/domain";
import { NotFoundException } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { IAuthenticatedUser, IRequestUser } from "./IAuthenticatedUser";

export class AuthenticatedUser implements IAuthenticatedUser {
  private _props: IAuthenticatedUser;
  constructor(props: IRequestUser) {
    this._props = {
      id: props.sub || "",
      email: props["https://www.drop-engine.com/email"] || "",
      metadata: {
        accounts: [],
        authorization: { groups: [], permissions: [], roles: [] },
      },
    };
    const meta: IUserMetadata =
      props["https://www.drop-engine.com/app_metadata"];
    if (meta) {
      this.metadata.accounts = meta.accounts ?? [];
    }
  }
  public get id(): string {
    return this._props.id;
  }
  public get email(): string {
    return this._props.email;
  }
  public get metadata(): IUserMetadata {
    return this._props.metadata;
  }

  public canManageOrders(accountId: string): boolean {
    const account: IUserAccount = this._props.metadata.accounts.find(
      (a) => a.id == accountId
    );
    if (!account) throw new NotFoundException(`UserNotFoundInAccount`);
    const canManageOrders = account.permissions.includes("manage:orders");
    return canManageOrders;
  }

  public get accounts(): IUserAccount[] {
    return cloneDeep(this._props.metadata.accounts);
  }
  public get account(): IUserAccount {
    return cloneDeep(this._props.metadata.accounts[0]);
  }
}
