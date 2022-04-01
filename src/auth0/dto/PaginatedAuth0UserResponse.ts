import { IAuth0User } from '../domain/Auth0ExtendedUser';


export interface PaginatedAuth0UserResponse {
  start: number;
  limit: number;
  length: number;
  users: IAuth0User[];
}
