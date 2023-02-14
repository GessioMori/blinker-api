import { redisClient } from "@/infra/redis/redisClient";
import { AppError } from "@/utils/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

let limiter: RateLimiterRedis;

export function createRateLimiter() {
  limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rateLimiter",
    points: 10,
    duration: 10,
  });
}

export async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError("Too many requests.", 429);
  }
}
