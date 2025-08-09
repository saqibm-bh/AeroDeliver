import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User decorator to extract user data from request
 * Usage:
 * @User() user: any - gets the whole user object
 * @User('id') userId: string - gets the user id
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
