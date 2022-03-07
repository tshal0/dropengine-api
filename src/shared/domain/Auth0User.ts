import { UnprocessableEntityException } from "@nestjs/common";
import { Request } from "express";
export const extractUser = (req: Request): IAuthorizedUser => {
  const user: IAuthorizedUser = req["user"] as any;
  return user;
};

export interface IAuthorizedUser {
  "https://www.myeasymonogram.com/email": string;
  "https://www.myeasymonogram.com/app_metadata": IAppMetadata;
  sub: string;
  permissions: string[];
}

export interface IAppMetadata {
  roles: string[];
  primary_user_id: string;
}
export class AppMetadata implements IAppMetadata {
  roles: string[];
  primary_user_id: string;
}
export class AuthorizedUser {
  protected props: IAuthorizedUser;
  private constructor(request: Request) {
    let user = extractUser(request);
    if (!user) throw new UnprocessableEntityException(`UserNotFound`);
    this.props = user;
  }

  public static create(request: Request): AuthorizedUser {
    let user = new AuthorizedUser(request);
    return user;
  }

  isGlobalAdmin(): boolean {
    return false;
  }

  get primaryUserId() {
    return this.props["https://www.myeasymonogram.com/app_metadata"]
      ?.primary_user_id;
  }

  get roles() {
    return this["https://www.myeasymonogram.com/app_metadata"].roles;
  }
  get email() {
    return this["https://www.myeasymonogram.com/email"];
  }
}
