import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

import { ItemEntity } from '../interfaces/item.interface';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
@ObjectType()
export class Item implements ItemEntity {
  @Field(() => String, { name: 'id' })
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String, { description: 'Nombre del item' })
  @Prop({ required: true })
  name: string;

  @Field(() => Float)
  @Prop({ required: true })
  quantity: number;

  @Field(() => String, { nullable: true })
  @Prop()
  quantityUnits?: string; // g, ml, kg

  @Field(() => Boolean, { nullable: true })
  @Prop()
  status: boolean;

  @Field(() => Date, { nullable: true })
  @Prop()
  updatedAt?: Date;
  // stores
  // user
}

export const ItemSchema = SchemaFactory.createForClass(Item);
