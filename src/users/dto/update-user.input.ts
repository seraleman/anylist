import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsMongoId, IsOptional } from 'class-validator';

import { CreateUserInput } from './create-user.input';
import { ValidRole } from 'src/auth/enums/valid-role.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsMongoId()
  id: string;

  @Field(() => [ValidRole], { nullable: true })
  @IsArray({})
  @IsOptional()
  roles?: ValidRole[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
