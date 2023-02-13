import "reflect-metadata";
import "express-async-errors";
import "./containers";
import express from "express";
import session from "express-session";
import { userRouter } from "./modules/user/user.routes";
import { errorHandler } from "./utils/errors/errorHandler";
import { redisStore } from "./redis/redisStore";
import { privateLinkRouter } from "@privateLink/privateLink.routes";

const app = express();

app.use(express.json());

app.use(
  session({
    store: redisStore,
    secret: process.env.REDIS_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use("/user", userRouter);
app.use("/pl", privateLinkRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
