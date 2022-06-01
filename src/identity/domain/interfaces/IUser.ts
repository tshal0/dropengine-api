export interface IUserAccount {
  id: string;
  companyCode: string;
  name: string;
  roles: string[];
  permissions: string[];
}
export interface IUserAuthorization {
  groups?: string[];
  roles?: string[];
  permissions?: string[];
}

export interface IUserMetadata {
  authorization: IUserAuthorization;
  accounts: IUserAccount[];
}

export interface IUser {
  email?: string;
  emailVerified?: boolean;
  name?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  locale?: string;
  updatedAt?: Date;
  id?: string;
  nickname?: string;
  createdAt?: Date;
  metadata?: IUserMetadata;
  lastIp?: string;
  lastLogin?: Date;
  loginsCount?: number;
}
