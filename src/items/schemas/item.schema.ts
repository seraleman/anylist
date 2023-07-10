import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from 'src/users/schemas/user.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
@ObjectType()
export class Item {
  @Field(() => ID, { name: 'id' }) // Anotación del campo "id" como tipo ID
  id: string;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop({ required: false })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  // ! relationships
  // * manyToOne
  @Field(() => User, { nullable: true })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: { name: 'userIndex' },
  })
  user: User;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.set('toObject', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
