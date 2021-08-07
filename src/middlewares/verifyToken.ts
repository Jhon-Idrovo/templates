import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/utils";
/**
 * Verify the access token. If valid include the payload in the req's body.
 * If not, return an "Authorization failed" error message to the client.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function verifyTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["x-access-token"];
  const payload = token ? verifyToken(token as string) : false;
  console.log(token, payload);

  if (payload) {
    req.body.decodedtToken = payload;
    return next();
  }
  return res.json({ error: "Authorization failed" });
}
