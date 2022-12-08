import { Module } from '@nestjs/common';
import { ValidateMongoDB } from './helpers/validate-mongo-id.helper';

@Module({
  providers: [ValidateMongoDB],
  exports: [ValidateMongoDB],
})
export class CommonModule {}
