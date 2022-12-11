import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignupInput, SigninInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'signin' })
  async signin(
    @Args('signinInput') signinInput: SigninInput,
  ): Promise<AuthResponse> {
    return this.authService.signin(signinInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/**[ValidRoles.admin]*/) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
