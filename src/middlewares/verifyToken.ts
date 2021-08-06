import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/utils";

export function verifyTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["x-access-token"];
  const isValid = token ? verifyToken(token as string) : false;
  console.log(token, isValid);

  if (isValid) return next();
  return res.json({ error: "Authentication failed" });
}
