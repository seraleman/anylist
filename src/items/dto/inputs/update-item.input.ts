import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import { CreateItemInput } from './create-item.input';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsString()
  id: string;
}
