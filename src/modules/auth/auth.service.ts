import { inject, injectable } from "tsyringe";
import { verify } from "argon2";
import { LoginInputType } from "./auth.schema";
import { AppError } from "@/utils/errors/AppError";
import { UserOutputType } from "@user/user.schema";
import { UserRepository } from "@user/repositories/user.repository";

@injectable()
export class AuthService {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}

  async login({ email, password }: LoginInputType): Promise<UserOutputType> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("Invalid credentials", 401);

    const passwordIsValid = await verify(user.password, password);

    if (!passwordIsValid) throw new AppError("Invalid credentials", 401);

    const { password: _, ...parsedUser } = user;

    return parsedUser;
  }
}
