import { inject, injectable } from "tsyringe";
import { UserRepository } from "./repositories/user.repository";
import { createUserInputType, userOutputType } from "./user.schema";
import { hash } from "argon2";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async createUser({
    email,
    name,
    password,
  }: createUserInputType): Promise<userOutputType> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) throw new Error("User already exists");

    const hashedPassword = await hash(password);

    const newUser = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return newUser;
  }
}
