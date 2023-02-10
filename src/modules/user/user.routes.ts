import { authMiddleware } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { container } from "tsyringe";
import { validateRequest } from "zod-express-middleware";
import { UserController } from "./user.controller";
import { CreateUserInputSchema, UserLoginInputSchema } from "./user.schema";

const userController = container.resolve(UserController);

const userRouter = Router();

userRouter.post(
  "/signup",
  validateRequest({ body: CreateUserInputSchema }),
  userController.handleCreateUser.bind(userController)
);
userRouter.post(
  "/login",
  validateRequest({ body: UserLoginInputSchema }),
  userController.handleLogin.bind(userController)
);
userRouter.delete("/logout", userController.handleLogout.bind(userController));

userRouter.get(
  "/me",
  authMiddleware,
  userController.handleGetUser.bind(userController)
);

export { userRouter };
