import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
