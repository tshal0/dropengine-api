import { IUserAccount, IUserMetadata } from "@accounts/domain";
import { NotFoundException } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { IAuthenticatedUser, IRequestUser } from "./IAuthenticatedUser";

export class AuthenticatedUser implements IAuthenticatedUser {
  private _props: IAuthenticatedUser;
  protected constructor(props: IAuthenticatedUser) {
    this._props = props;
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
    
    if (!this._props.metadata.accounts.length) {
      return false;
    }
    const account: IUserAccount = this._props.metadata?.accounts?.find(
      (a) => a.id == accountId
    );
    if (!account)
      throw new NotFoundException({
        name: `UserNotFoundInAccount`,
        accounts: this._props.metadata.accounts.map((a) => ({
          id: a.id,
          companyCode: a.companyCode,
        })),
        userId: this._props.id,
      });
    const canManageOrders = account.permissions.includes("manage:orders");
    return canManageOrders;
  }

  public get accounts(): IUserAccount[] {
    return cloneDeep(this._props.metadata?.accounts || []);
  }
  public get account(): IUserAccount {
    return cloneDeep(this._props.metadata?.accounts[0]);
  }

  public static load(props: IRequestUser) {
    const email = props["https://www.drop-engine.com/email"] || props.email;
    const userId = props.sub;
    const meta: IUserMetadata =
      props["https://www.drop-engine.com/app_metadata"];
    const dto: IAuthenticatedUser = {
      id: userId,
      email: email,
      metadata: meta,
    };
    return new AuthenticatedUser(dto);
  }
}
