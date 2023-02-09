import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "./user.controller";

const userController = container.resolve(UserController);

const userRouter = Router();

userRouter.post("/", userController.handleCreateUser.bind(userController));

export { userRouter };
