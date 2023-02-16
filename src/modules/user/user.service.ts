import { inject, injectable } from "tsyringe";
import { UserRepository } from "./repositories/user.repository";
import {
  CreateUserInputType,
  UpdateSubscriptionsType,
  UserLoginInputType,
  UserOutputSchema,
  UserOutputType,
  UserType,
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
      throw new AppError("Email or password incorrect", 401);
    }

    const passwordMatch = await verify(user.password, password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect", 401);
    }

    const parsedUser = UserOutputSchema.parse(user);

    return parsedUser;
  }

  async updateSubscriptions(
    data: UpdateSubscriptionsType
  ): Promise<UserOutputType> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    let updatedUser: UserType;

    if (data.action === "add") {
      if (user.subscriptions.includes(data.blogName)) {
        throw new AppError("Subscription already exists", 400);
      }
      updatedUser = await this.userRepository.updateSubscriptions({
        subscriptions: [...user.subscriptions, data.blogName],
        userId: data.userId,
      });
    } else {
      if (!user.subscriptions.includes(data.blogName)) {
        throw new AppError("Subscription does not exist", 400);
      }
      updatedUser = await this.userRepository.updateSubscriptions({
        subscriptions: user.subscriptions.filter(
          (subscription) => subscription !== data.blogName
        ),
        userId: data.userId,
      });
    }

    const parsedUpdatedUser = UserOutputSchema.parse(updatedUser);
    return parsedUpdatedUser;
  }
}
