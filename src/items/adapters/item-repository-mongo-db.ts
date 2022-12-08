import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';

import { CreateItemInput, UpdateItemInput } from '../dto/inputs';
import { Item, ItemDocument } from '../schemas/item.schema';
import { ItemRepository } from '../interfaces/item-repository.interface';
import { ValidateMongoDB } from 'src/common/helpers/validate-mongo-id.helper';

@Injectable()
export default class ItemRepositoryMongoDB implements ItemRepository {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private readonly validateMongoDB: ValidateMongoDB,
  ) {}

  async create(createItemttype: CreateItemInput): Promise<Item> {
    const product = new this.itemModel(createItemttype);
    return await product.save();
  }

  async findAll(): Promise<Item[]> {
    return await this.itemModel.find();
  }

  async findById(id: string): Promise<Item> {
    if (!this.validateMongoDB.isvalidId(id))
      throw new BadRequestException(`Id ${id} is not a valid MongoID`);
    return await this.itemModel.findById(id);
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, updateItemInput, {
      new: true,
    });
  }

  async softDelete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, {
      status: false,
      updatedAt: DateTime.now(),
    });
  }

  //   async findAll(paginationDto: PaginationDto): Promise<Product[]> {
  //     const { offset = 1, limit = 10 } = paginationDto;
  //     return await this.productModel.find().skip(offset).limit(limit);
  //   }

  //   async search(term: string): Promise<FindProducts> {
  //     let product: Product;
  //     if (isValidObjectId(term)) {
  //       product = await this.productModel.findById(term);
  //       return {
  //         queriedFields: ['id'],
  //         results: product ? [product] : [],
  //       };
  //     }

  //     const regex = new RegExp(term, 'i');
  //     const products = await this.productModel.find({
  //       $or: [{ title: regex }, { slug: term }],
  //     });

  //     return {
  //       queriedFields: ['title', 'slug'],
  //       results: products,
  //     };
  //   }
}
