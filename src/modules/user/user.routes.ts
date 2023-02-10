import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "./user.controller";

const userController = container.resolve(UserController);

const userRouter = Router();

userRouter.post(
  "/signup",
  userController.handleCreateUser.bind(userController)
);
userRouter.post("/login", userController.handleLogin.bind(userController));
userRouter.delete("/logout", userController.handleLogout.bind(userController));
userRouter.get(
  "/me",
  authMiddleware,
  userController.handleGetUser.bind(userController)
);

export { userRouter };
