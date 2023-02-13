import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

redisClient.connect().catch(console.error);
