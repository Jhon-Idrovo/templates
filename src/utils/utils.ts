import jwt, { Secret } from "jsonwebtoken";
/**
 *
 * @param userId the generated user id
 * @returns jwt token
 */
export function generateSignUpToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET as Secret, {
    expiresIn: 3600,
  });
}
