import { CompanyCode } from "../valueObjects/CompanyCode";
import { AccountId } from "../valueObjects/AccountId";
import { IStore, IStoreProps } from "./IStore";
import { Store } from "../aggregates/Store";

export interface IAccount {
  id: AccountId;
  name: string;

  ownerId: string;
  companyCode: CompanyCode;

  stores: Store[];

  updatedAt: Date;
  createdAt: Date;
}
export interface IAccountProps {
  id: string;
  name: string;
  ownerId: string;
  companyCode: string;

  stores: IStoreProps[];

  updatedAt: Date;
  createdAt: Date;
}
