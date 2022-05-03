import { User } from "@auth/domain";
import { Account } from "@auth/domain/aggregates/Account";

export interface IAccountStoreDto {
  id: string;
  name: string;
}
export interface IAccountResponseDto {
  id: string;
  name: string;
  ownerId: string;
  companyCode: string;
  members: AccountMemberDto[];
  stores: IAccountStoreDto[];
}
export class AccountStoreDto {
  constructor(props: any) {}
}
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
    const props = acct.entity().props(1);
    let dto = new AccountResponseDto({
      id: props.id,
      name: props.name,
      ownerId: props.ownerId,
      companyCode: props.companyCode,
      members: [],
      stores:
        props.stores?.map((s) => ({ id: s.id, name: s.name })) || undefined,
    });
    return dto;
  }
}
