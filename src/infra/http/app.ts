import "reflect-metadata";
import "express-async-errors";
import "../../utils/containers";
import swagger from "swagger-ui-express";
import swaggerFile from "./swagger.json";
import express from "express";
import session from "express-session";
import { userRouter } from "../../modules/user/user.routes";
import { errorHandler } from "../../utils/errors/errorHandler";
import { redisStore } from "../redis/redisStore";
import { privateLinkRouter } from "@privateLink/privateLink.routes";
import { blogLinkRouter } from "@/modules/blogLink/blogLink.routes";
import { createRateLimiter, rateLimiter } from "./rateLimiter/rateLimiter";

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

if (process.env.NODE_ENV !== "test") {
  createRateLimiter();
  app.use(rateLimiter);
}

app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile));
app.use("/user", userRouter);
app.use("/pl", privateLinkRouter);
app.use("/bl", blogLinkRouter);

app.use(errorHandler);

export { app };
