import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.session.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }
  next();
};
