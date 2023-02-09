import "reflect-metadata";
import "./containers";
import express from "express";
import session from "express-session";
import { userRouter } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "secret",
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
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
