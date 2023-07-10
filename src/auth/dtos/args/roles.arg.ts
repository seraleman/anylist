import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { ValidRole } from 'src/auth/enums/valid-role.enum';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [ValidRole], { nullable: true })
  @IsArray()
  roles: ValidRole[] = [];
}
