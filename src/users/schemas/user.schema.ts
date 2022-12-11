import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID, { name: 'id' })
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ require: true })
  fullName: string;

  @Field(() => String)
  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ min: 6 })
  password?: string;

  @Field(() => [String])
  @Prop({ default: ['user'] })
  roles: string[];

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  // Todo: Relaciones
}

export const UserSchema = SchemaFactory.createForClass(User);
