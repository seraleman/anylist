import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { SignupInput } from '../auth/dtos/inputs/signup.input';
import { User } from './schemas/user.schema';
import { ValidRole } from 'src/auth/enums/valid-role.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = await this.userModel.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return newUser;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRole[]): Promise<User[]> {
    return roles.length === 0
      ? await this.userModel.find().populate('lastUpdateBy').populate('items')
      : await this.userModel
          .find({ roles: { $in: roles } })
          .populate('lastUpdateBy')
          .populate('items');
  }

  async findOneByEmailForAuth(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new BadRequestException('Incorrect credentials');
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).populate('lastUpdateBy');
      if (!user)
        throw new BadRequestException(`User with id '${id}' not found`);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async update(updateUserInput: UpdateUserInput, user: User): Promise<User> {
    const { id } = updateUserInput;
    try {
      const userUpdated = await this.userModel
        .findByIdAndUpdate(
          id,
          { ...updateUserInput, lastUpdateBy: user.id },
          { new: true },
        )
        .populate('lastUpdateBy');

      if (!userUpdated)
        throw new BadRequestException(`User with id '${id}' not found`);

      return userUpdated;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    const userUpdated = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: false, lastUpdateBy: user.id },
        { new: true },
      )
      .populate('lastUpdateBy');

    if (!userUpdated)
      throw new BadRequestException(`User with id '${id}' not found`);
    return userUpdated;
  }

  private handleDBErrors(error: any): never {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      throw new BadRequestException(
        `Field '${duplicatedField}' with value '${error.keyValue[duplicatedField]}' already exists`,
      );
    }

    if (error.status === 400) throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Please chech server logs');
  }
}
