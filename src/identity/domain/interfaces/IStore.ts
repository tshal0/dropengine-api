import { Account } from "../aggregates/Account";
import { AccountId } from "../valueObjects/AccountId";
import { StoreId } from "../valueObjects/StoreId";
import { IAccountProps } from "./IAccount";

export interface IStore {
  id: StoreId;
  name: string;

  account: Account;
  updatedAt: Date;
  createdAt: Date;
}

export interface IStoreProps {
  id: string;
  name: string;

  account: IAccountProps;
  updatedAt: Date;
  createdAt: Date;
}
