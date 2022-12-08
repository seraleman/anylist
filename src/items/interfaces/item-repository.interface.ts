import { CreateItemInput, UpdateItemInput } from '../dto/inputs';
import { Item } from '../schemas/item.schema';

export interface ItemRepository {
  create(product: CreateItemInput): Promise<Item>;
  findAll(): Promise<Item[]>;
  findById(id: string): Promise<Item>;
  update(id: string, updateItemInput: UpdateItemInput): Promise<Item>;
  softDelete(id: string): Promise<Item>;
  //   findAll(paginationDto: PaginationDto): Promise<Item[]>;
  //   search(term: string): Promise<FindProducts>;
}
