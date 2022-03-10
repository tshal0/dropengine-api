export class CreateUserDto {
  id?: string | undefined;
  email: string;
  picture?: string | undefined;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateAuth0UserDto {
  client_id: string;
  email: string;
  password: string;
  connection: string;
  username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  nickname?: string;
  picture?: string;
}
export interface CreateAuth0UserResponseDto {
  _id: string;
  email_verified: boolean;
  email: string;
  username: string;
  given_name: string;
  family_name: string;
  name: string;
  nickname: string;
  picture: string;
}
export interface AppMetadataAuthorization {
  groups?: string[];
  roles?: any[];
  permissions?: any[];
}
export interface Auth0AppMetadata {
  authorization?: AppMetadataAuthorization;
  primary_user_id: string;
  roles?: string[];
}
export interface IAuth0ExtendedUser {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  updated_at?: Date;
  user_id?: string;
  nickname?: string;
  created_at?: Date;
  app_metadata?: Auth0AppMetadata;
  last_ip?: string;
  last_login?: Date;
  logins_count?: number;
}
