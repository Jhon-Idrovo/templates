import jwt, { Secret } from "jsonwebtoken";
import { tokenLifetime } from "../config";
/**
 *
 * @param userId the generated user id
 * @returns jwt token
 */
export function generateClientToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET as Secret, {
    expiresIn: tokenLifetime,
  });
}
/**
 *
 * @param token jwt token issued previously
 * @returns payload if the token is valid. Otherwise, false.
 */
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET as Secret);
    return payload;
  } catch (error) {
    return false;
  }
}
