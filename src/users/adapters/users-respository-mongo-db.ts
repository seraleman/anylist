import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';

import { UsersRepositoryAbstract } from '../abstracts/users-repository.abstract';
import { User, UserDocument } from '../schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export default class UsersRepositoryMongoDB implements UsersRepositoryAbstract {
  private logger = new Logger('UsersRepositoryMongoDB');

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = new this.userModel(signupInput);
      return await user.save();
    } catch (error) {
      throw this.handlerDBErrors(error);
    }
  }

  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user)
        throw new NotFoundException(
          `User with id '${id}' is not exists in BD'`,
        );
      return user;
    } catch (error) {
      throw this.handlerDBErrors(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user)
        throw new NotFoundException(
          `User with email '${email}' is not exists in BD'`,
        );
      return user;
    } catch (error) {
      throw this.handlerDBErrors(error);
    }
  }

  handlerDBErrors(error: any): never {
    if (error.code === 11000) {
      this.logger.error(error);
      throw new BadRequestException(`Duplicated key ${error.keyValue}`);
    }
    if (error.status === 404) {
      this.logger.error(error.response.message);
      throw new NotFoundException(error.response);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
