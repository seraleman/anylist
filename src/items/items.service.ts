import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './schemas/item.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const session = await this.itemModel.db.startSession();
    session.startTransaction();

    try {
      const newItem = new this.itemModel({
        ...createItemInput,
        user: user.id,
      });

      await newItem.save({ session });
      user.items.push(newItem);

      const { id, ...rest } = user;

      await this.userModel.findByIdAndUpdate(id, rest);

      await session.commitTransaction();
      session.endSession();
      return newItem.populate('user');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findAll(user: User): Promise<Item[]> {
    return await this.itemModel.find({ user: user.id }).populate('user');
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemModel
      .findOne({ _id: id, user: user.id })
      .populate('user');

    if (!item) this.notFoundException(id);

    return item;
  }

  async update(updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    const { id, ...rest } = updateItemInput;

    const item = await this.itemModel
      .findOneAndUpdate({ _id: id, user: user.id }, rest, {
        new: true,
      })
      .populate('user');

    if (!item) this.notFoundException(id);

    return item;
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.itemModel
      .findOneAndRemove({ _id: id, user: user.id })
      .populate('user');

    if (!item) this.notFoundException(id);

    return item;
  }

  private notFoundException(id: string): NotFoundException {
    throw new NotFoundException(`Item with id '${id}' not found`);
  }
}
