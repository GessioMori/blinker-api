import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://:@localhost:6379",
  legacyMode: true,
});

redisClient.connect().catch(console.error);
