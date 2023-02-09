import { User } from "@prisma/client";
import { Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { createLocalStrategy } from "./passport/strategies/local.strategy";

@injectable()
export class AuthController {
  constructor(
    @inject("AuthService") private readonly authService: AuthService
  ) {}

  getUser(request: Request, response: Response) {
    if (!request.user) return response.status(401).send("Unauthorized");
    return response.send(request.user);
  }

  initialize() {
    passport.use(
      "local",
      createLocalStrategy(this.authService.login.bind(this.authService))
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user: User, done) => {
      if (!user) {
        done(null, false);
      }
      done(null, user);
    });
  }
}
