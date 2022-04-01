import { IUser } from "@accounts/domain/interfaces/IUser";
import { User } from "../domain/aggregates";

export class CreateAccountApiDto {
  name: string;
  companyCode: string;
  ownerId: string;
  memberIds: string[];
  defaultStoreName: string;
}

export class CreateAccountDto {
  name: string;
  companyCode: string;
  owner: IUser;
  defaultStoreName: string;
}

export class CreateAccountResponseDto {}

export class CreateStoreDto {
  name: string;
}
