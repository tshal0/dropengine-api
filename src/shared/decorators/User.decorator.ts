import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedUser } from "./AuthenticatedUser";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const val = request.user;
    const user = new AuthenticatedUser(val);
    return user;
  }
);
