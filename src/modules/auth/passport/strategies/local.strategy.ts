import { UserOutputType } from "@user/user.schema";
import { Strategy as LocalStrategy } from "passport-local";
import { LoginInputType } from "../../auth.schema";

type LoginFn = (data: LoginInputType) => Promise<UserOutputType>;

export const createLocalStrategy = (loginFn: LoginFn) => {
  return new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await loginFn({ email, password });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  );
};
