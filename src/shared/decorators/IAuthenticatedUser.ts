import { IUserMetadata } from "@accounts/domain";

export interface IAuthenticatedUser {
  id: string;
  email: string;
  metadata: IUserMetadata;
}

export interface IRequestUser {
  email: string;
  "https://www.drop-engine.com/email": string;
  "https://www.drop-engine.com/app_metadata": ReqUserAppMetadata;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  gty: string;
  permissions: string[];
}
export interface ReqUserAppMetadata {
  accounts: ReqUserAccount[];
  authorization: Authorization;
}
export interface Authorization {}

export interface ReqUserAccount {
  id: string;
  companyCode: string;
  name: string;
  roles: string[];
  permissions: string[];
}
