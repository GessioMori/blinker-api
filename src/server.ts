import "reflect-metadata";
import "./containers";
import express from "express";
import { userRouter } from "./modules/user/user.routes";

const app = express();

app.use(express.json());

app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
