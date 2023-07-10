import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Item } from 'src/items/schemas/item.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID, { name: 'id' })
  id: string;

  @Field(() => String)
  @Prop()
  fullName: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [{ type: String }], default: ['user'] })
  roles: string[];

  @Field(() => Boolean, { nullable: true })
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  // ! relationships
  // * manyToOne
  @Field(() => User, { nullable: true })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  lastUpdateBy?: User;

  // * oneToMany
  @Field(() => [Item])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  items: Item[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    return ret;
  },
});
