import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserService } from "./user.service";

@injectable()
export class UserController {
  constructor(
    @inject("UserService") private readonly userService: UserService
  ) {}

  async handleCreateUser(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { name, email, password } = request.body;

    const newUser = await this.userService.createUser({
      name,
      email,
      password,
    });

    return response.status(201).json(newUser);
  }
}
