import connect, { Client } from "connect-redis";
import session from "express-session";
import { redisClient } from "./redisClient";

const RedisStore = connect(session);

export const redisStore = new RedisStore({
  client: redisClient as any,
});
