import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from '@prisma/client';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: UserType;
  }
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserType => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as UserType;
  },
);
