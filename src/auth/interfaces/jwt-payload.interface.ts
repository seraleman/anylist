import { Schema as MongooseSchema } from 'mongoose';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
