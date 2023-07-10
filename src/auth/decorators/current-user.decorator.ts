import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ValidRole } from '../enums/valid-role.enum';
import { User } from 'src/users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (roles: ValidRole[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException(
        `No user inside the request - make sure that we used the AuthGuard`,
      );
    }

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      // todo: eliminar casteo de validRole
      if (roles.includes(role as ValidRole)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
