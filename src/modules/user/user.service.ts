import { inject, injectable } from "tsyringe";
import { UserRepository } from "./repositories/user.repository";
import {
  CreateUserInputType,
  UserLoginInputType,
  UserOutputSchema,
  UserOutputType,
} from "./user.schema";
import { hash, verify } from "argon2";
import { AppError } from "@/utils/errors/AppError";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async createUser({
    email,
    name,
    password,
  }: CreateUserInputType): Promise<UserOutputType> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await hash(password);

    const newUser = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const parsedUser = UserOutputSchema.parse(newUser);

    return parsedUser;
  }

  async login({
    email,
    password,
  }: UserLoginInputType): Promise<UserOutputType> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect", 400);
    }

    const passwordMatch = await verify(user.password, password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect", 400);
    }

    const parsedUser = UserOutputSchema.parse(user);

    return parsedUser;
  }
}
