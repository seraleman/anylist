import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  // 👈 new pipe

  transform(value: string) {
    if (!isMongoId(value)) {
      throw new BadRequestException(`Id '${value}' is not a mongoId`);
    }
    return value;
  }
}
