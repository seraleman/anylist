// import { ObjectId } from 'mongoose'.Types;
import { Types } from 'mongoose';

export class ValidateMongoDB {
  isvalidId(value: string) {
    return (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    );
  }
}
