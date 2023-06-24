import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = await this.itemModel.create(createItemInput);
    return newItem;
  }

  async findAll(): Promise<Item[]> {
    // todo: filtrar, paginar, por usuario...
    return await this.itemModel.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id);

    if (!item) this.notFoundException(id);

    return item;
  }

  async update(updateItemInput: UpdateItemInput): Promise<Item> {
    const { id, ...rest } = updateItemInput;

    const item = await this.itemModel.findByIdAndUpdate(id, rest, {
      new: true,
    });

    if (!item) this.notFoundException(id);

    return item;
  }

  async remove(id: string): Promise<Item> {
    // todo: soft delete, integridad referencial
    const item = await this.itemModel.findByIdAndRemove(id);

    if (!item) this.notFoundException(id);

    return item;
  }

  private notFoundException(id: string): NotFoundException {
    throw new NotFoundException(`Item with id '${id}' not found`);
  }
}
