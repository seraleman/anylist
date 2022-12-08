import { Schema as MongooseSchema } from 'mongoose';

export interface ItemEntity {
  _id?: MongooseSchema.Types.ObjectId; // Requerido para trabajar con Mongo y GraphQL - Nombrar a id
  id?: string;
  name: string;
  quantity: number;
  quantityUnits?: string; // g, ml, kg
  status?: boolean;
  updatedAt?: Date;
  // stores
  // user
}
