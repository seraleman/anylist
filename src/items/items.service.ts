import { Injectable, NotFoundException } from '@nestjs/common';

import { Item } from './schemas/item.schema';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import ItemRepositoryMongoDB from './adapters/item-repository-mongo-db';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepositoryMongoDB) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    return await this.itemRepository.create(createItemInput);
  }

  async findAll() {
    return await this.itemRepository.findAll();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findById(id);
    if (!item) throw new NotFoundException(`Item with id '${id}' not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput) {
    await this.findOne(id);
    return await this.itemRepository.update(id, updateItemInput);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.itemRepository.softDelete(id);
  }
}
