import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(
    @inject("AuthService") private readonly authService: AuthService
  ) {}

  async handleLogin(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await this.authService.login({ email, password });

    request.session.user = user;

    return response.json(user);
  }

  async getUser(request: Request, response: Response) {
    const { user } = request.session;

    return response.json(request.session);
  }
}
