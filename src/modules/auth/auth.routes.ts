import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";
import passport from "passport";

const authRouter = Router();

const authController = container.resolve(AuthController);

authController.initialize.bind(authController)();

authRouter.post(
  "/login",
  passport.authenticate("local"),
  authController.getUser.bind(authController)
);

export { authRouter };
