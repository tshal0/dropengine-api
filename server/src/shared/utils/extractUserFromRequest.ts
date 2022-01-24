import { IAuthorizedUser } from '@shared/domain/Auth0User';
import { Request } from 'express';
export const extractUser = (req: Request): IAuthorizedUser => {
  const user: IAuthorizedUser = req['user'] as any;
  return user;
};
