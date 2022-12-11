import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { User } from '../schemas/user.schema';

export abstract class UsersRepositoryAbstract {
  abstract create(signupInput: SignupInput): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
}
