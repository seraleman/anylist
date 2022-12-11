import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { UsersRepositoryAbstract } from './abstracts/users-repository.abstract';
import { Logger } from '@nestjs/common/services';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');
  constructor(private readonly userRepository: UsersRepositoryAbstract) {}

  async create(signupInput: SignupInput): Promise<User> {
    return this.userRepository.create({
      ...signupInput,
      password: bcrypt.hashSync(signupInput.password, 10),
    });
  }

  async findAll() {
    return [];
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  block(id: string): Promise<User> {
    throw new Error(`block not implementes`);
  }
}
