import { inject, injectable } from "tsyringe";
import { UserRepository } from "./repositories/user.repository";
import { CreateUserInputType, UserOutputType } from "./user.schema";
import { hash } from "argon2";
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
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await hash(password);

    const newUser = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const { password: _, ...parsedUser } = newUser;

    return parsedUser;
  }
}
