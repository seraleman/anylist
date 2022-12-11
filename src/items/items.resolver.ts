import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { Item } from './schemas/item.schema';
import { ItemsService } from './items.service';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item, { name: 'removeItem' })
  sofDeleteItem(@Args('id', { type: () => ID }) id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
