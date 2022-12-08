import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommonModule } from 'src/common/common.module';
import { Item, ItemSchema } from './schemas/item.schema';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import ItemRepositoryMongoDB from './adapters/item-repository-mongo-db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    CommonModule,
  ],
  providers: [ItemsResolver, ItemsService, ItemRepositoryMongoDB],
})
export class ItemsModule {}
