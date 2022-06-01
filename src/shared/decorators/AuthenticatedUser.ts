import { IUserAccount, IUserMetadata } from "@identity/domain";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IsString, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { cloneDeep } from "lodash";
import { IAuthenticatedUser, IRequestUser } from "./IAuthenticatedUser";

export class AuthenticatedUser implements IAuthenticatedUser {
  constructor(props: IAuthenticatedUser) {
    this.id = props.id;
    this.email = props.email;
    this.metadata = props.metadata;
  }
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsNotEmptyObject()
  metadata: IUserMetadata;

  public canManageOrders(accountId: string): boolean {
    if (!this.metadata.accounts.length) {
      return false;
    }
    const account: IUserAccount = this.metadata?.accounts?.find(
      (a) => a.id == accountId
    );
    if (!account)
      throw new UnauthorizedException({
        name: `UserNotFoundInAccount`,
        accounts: this.metadata.accounts.map((a) => ({
          id: a.id,
          companyCode: a.companyCode,
        })),
        userId: this.id,
      });
    const canManageOrders = account.permissions.includes("manage:orders");
    return canManageOrders;
  }

  public get accounts(): IUserAccount[] {
    return cloneDeep(this.metadata?.accounts || []);
  }
  public get account(): IUserAccount {
    return cloneDeep(this.metadata?.accounts[0]);
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
