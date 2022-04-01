import { User } from "@accounts/domain";
import { Store } from "@accounts/domain/aggregates/Store";

export interface IStoreResponseDto {
  id: string;
  name: string;
  accountId: string;
}
export class StoreResponseDto {
  private _props: IStoreResponseDto;
  protected constructor(props: IStoreResponseDto) {
    this._props = props;
  }
  /**
   * Returns the raw props.
   * @returns {DbStore}
   */
  public json(): IStoreResponseDto {
    return Object.seal(this._props);
  }
  public static from(acct: Store) {
    const props = acct.props();
    let dto = new StoreResponseDto({
      id: props.id,
      name: props.name,
      accountId: props.account?.id,
    });
    return dto;
  }
}
