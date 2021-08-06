/**
 * logic for handling auth requests
 */

import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import { generateAccessToken } from "../utils/utils";
/**
 * Verifies username and password against the database. If good, returns an object
 * with an access token and refresh token. The user roles are send in the payload of the
 * access token.
 * @param req
 * @param res
 * @param next
 */
export async function signInHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("roles");
    if (user) {
      //compare passwords
      return (await user.comparePassword(user.password, password))
        ? res.status(200).json({
            accessToken: generateAccessToken(
              user._id,
              user.roles.map((role) => role.name)
            ),
            //this is optional, you should not rely on this to grant access because it's easy to modify
            //use the access token payload instead
            roles: user.roles.map((role) => role.name),
          })
        : res.json({ error: "Invalid password", token: null });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
}

/**
 * Takes in a refresh token and sends back a new access token if the
 * first is valid.
 * @param req
 * @param res
 * @param next
 */
export async function getRefreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.headers["x-refresh-token"];
  if (refreshToken) {
  }
}
/**
 * Given a username, email and password, creates a new user assgining it a 'User' role
 * returns a jwt to the server or an error
 * @param req
 * @param res
 * @param next
 */
export async function signUpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, email } = req.body;
    const userRole = await Role.findOne({ name: "User" });
    const user = await new User({
      username,
      email,
      //we don't need the await in this call but an error detects it as promise even if it is not
      password: await User.encryptPassword(password),
      roles: [userRole?._id],
    }).save();
    user.populate("roles");
    return res.status(201).json({
      accessToken: generateAccessToken(
        user._id,
        user.roles.map((role) => role.name)
      ),
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
/**
 * Given the email, username, password and correct admin access password,
 * it creates a new user with a role of "Admin"
 * Then, it sends back to the client a jwt token.
 * @param req
 * @param res
 * @param next
 */
export async function createAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, email, adminAccessPassword } = req.body;
    if (adminAccessPassword === process.env.CREATE_ADMIN_PASSWORD) {
      const adminRole = await Role.findOne({ name: "Admin" });
      const admin = await new User({
        username,
        email,
        //we don't need the await in this call but an error detects it as promise even if it is not
        password: await User.encryptPassword(password),
        roles: [adminRole?._id],
      }).save();

      return res
        .status(201)
        .json({ accessToken: generateAccessToken(admin._id, ["Admin"]) });
    }
    res.json({ error: "Admin access password invalid" });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
