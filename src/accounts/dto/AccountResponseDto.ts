import { User } from "@accounts/domain";
import { Account, IAccountProps } from "@accounts/domain/aggregates/Account";

export class AccountMemberDto {
  constructor(u: User) {
    let props = u.props();
    this.email = props.email;
    this.lastLogin = props.lastLogin;
    this.picture = props.picture;
    this.userId = props.id;
  }
  userId: string;
  picture: string;
  email: string;
  roles: string[];
  permissions: string[];
  lastLogin: Date;
}
export interface IAccountResponseDto {
  id: string;
  name: string;
  ownerId: string;
  companyCode: string;
  members: AccountMemberDto[];
}
export class AccountResponseDto {
  private _props: IAccountResponseDto;
  protected constructor(props: IAccountResponseDto) {
    this._props = props;
  }
  /**
   * Returns the raw props.
   * @returns {DbAccount}
   */
  public json(): IAccountResponseDto {
    return Object.seal(this._props);
  }
  public static from(acct: Account) {
    const props = acct.props();
    let dto = new AccountResponseDto({
      id: props.id,
      name: props.name,
      ownerId: props.ownerId,
      companyCode: props.companyCode,
      members: [],
    });
    return dto;
  }
}
