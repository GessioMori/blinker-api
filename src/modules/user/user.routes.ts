import { authMiddleware } from "@/utils/middlewares/auth.middleware";
import { Router } from "express";
import { container } from "tsyringe";
import { validateRequest } from "zod-express-middleware";
import { UserController } from "./user.controller";
import {
  CreateUserInputSchema,
  UpdateSubscriptionsBaseSchema,
  UserLoginInputSchema,
} from "./user.schema";

const userController = container.resolve(UserController);

const userRouter = Router();

userRouter.post(
  "/create",
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

userRouter.put(
  "/subscription",
  authMiddleware,
  validateRequest({ body: UpdateSubscriptionsBaseSchema }),
  userController.updateSubscription.bind(userController)
);

export { userRouter };
