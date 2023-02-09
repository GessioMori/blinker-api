import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";

const authController = container.resolve(AuthController);

const authRouter = Router();

authRouter.post("/login", authController.handleLogin.bind(authController));
authRouter.get("/user", authController.getUser.bind(authController));

export { authRouter };
