import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { MongoIdPipe } from 'src/items/pipes/parse-mongo-id.pipe';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ValidRole } from 'src/auth/enums/valid-role.enum';
import { ValidRolesArgs } from 'src/auth/dtos/args/roles.arg';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRole.admin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, MongoIdPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRole.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput', { type: () => UpdateUserInput })
    updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRole.admin]) adminUser: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, adminUser);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, MongoIdPipe) id: string,
    @CurrentUser([ValidRole.admin]) adminUser: User,
  ): Promise<User> {
    return this.usersService.block(id, adminUser);
  }
}
