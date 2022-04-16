import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedUser } from "./AuthenticatedUser";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const val = request.user;
    console.debug(JSON.stringify(val, null, 2));
    try {
      const user = AuthenticatedUser.load(val);
      return user;
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      return {};
    }
  }
);
