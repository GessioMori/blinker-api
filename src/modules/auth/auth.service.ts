import { inject, injectable } from "tsyringe";
import { UserRepository } from "../user/repositories/user.repository";
import { loginInputType } from "./auth.schema";
import { verify } from "argon2";

@injectable()
export class AuthService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async login({ email, password }: loginInputType) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    const passwordIsValid = await verify(user.password, password);

    if (!passwordIsValid) throw new Error("Invalid credentials");

    const { password: _, ...parsedUser } = user;

    return parsedUser;
  }
}
