import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersRepositoryAbstract } from './abstracts/users-repository.abstract';
import UsersRepositoryMongoDB from './adapters/users-respository-mongo-db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    { provide: UsersRepositoryAbstract, useClass: UsersRepositoryMongoDB },
  ],
  exports: [
    // MongooseModule,
    UsersService,
  ],
})
export class UsersModule {}
