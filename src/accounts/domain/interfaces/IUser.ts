export interface IUserAccount {
  id: string;
  companyCode: string;
  name: string;
  roles: string[];
  permissions: string[];
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
  metadata?: {
    authorization: { groups?: string[]; roles?: any[]; permissions?: any[] };
    accounts: IUserAccount[];
  };
  lastIp?: string;
  lastLogin?: Date;
  loginsCount?: number;
}
