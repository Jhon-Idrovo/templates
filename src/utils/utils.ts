import jwt, { Secret } from "jsonwebtoken";
import { RoleName } from "../../interfaces/roles";
import { accessTokenLifetime, refreshTokenLifetime } from "../config";
/**
 *
 * @param userId the generated user id
 * @returns jwt access token with user roles and id as payload
 */
export function generateAccessToken(userId: string, role: RoleName[]) {
  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET as Secret, {
    expiresIn: accessTokenLifetime,
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

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET as Secret, {
    expiresIn: refreshTokenLifetime,
  });
}
