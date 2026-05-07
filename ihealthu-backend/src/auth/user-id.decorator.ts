// for @UserId() shorthand decorator

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Instead of writing @Req() req and then req.userId every time,
// we create a shorthand decorator: @UserId()
// This reads the userId that JwtGuard attached to the request.

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
  },
);