import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
@ObjectType()
export class Item {
  @Field(() => ID, { name: 'id' }) // Anotación del campo "id" como tipo ID
  _id: string;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => Float)
  quantity: number;

  @Prop({ isRequired: false })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
