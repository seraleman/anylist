import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

import { AuthResponse } from './dto/types/auth-response.type';
import { SignupInput, SigninInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/schemas/user.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = this.getJwtToken(user._id.valueOf().toString());
    return { token, user };
  }

  async signin({ email, password }: SigninInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email / password do not match');

    const token = this.getJwtToken(user._id.valueOf().toString());
    return { token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user.isActive)
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user._id.valueOf().toString());
    return { token, user };
  }
}
