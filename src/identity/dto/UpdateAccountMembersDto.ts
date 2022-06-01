import { AccountId } from "@identity/domain/valueObjects/AccountId";

export interface IUpdateAccountMembersDto {
  id: AccountId;
  userId: string;
}

export interface IAddMemberDto {
  userId: string;
}
