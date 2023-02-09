import { inject, injectable } from "tsyringe";
import { UserRepository } from "./repositories/user.repository";
import { createUserInputType, userOutputType } from "./user.schema";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async createUser(user: createUserInputType): Promise<userOutputType> {
    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists) throw new Error("User already exists");

    const newUser = await this.userRepository.create(user);

    return newUser;
  }
}
