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

  async handleLogin(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user = await this.userService.login({ email, password });

    request.session.user = user;

    return response.status(200).json(user);
  }

  async handleLogout(request: Request, response: Response): Promise<void> {
    request.session.destroy(() => {
      return response.status(200).json({ message: "Logout successful" });
    });
  }

  async handleGetUser(request: Request, response: Response): Promise<Response> {
    const user = request.session.user;

    return response.status(200).json(user);
  }

  async updateSubscription(request: Request, response: Response) {
    const { id } = request.session.user;
    const { blogName, action } = request.body;

    const user = await this.userService.updateSubscriptions({
      userId: Number(id),
      blogName,
      action,
    });

    return response.status(200).json(user);
  }
}
