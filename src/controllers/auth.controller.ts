/**
 * logic for handling auth requests
 */

import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import { generateSignUpToken } from "../utils/utils";

export async function signInHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      (await user.comparePassword(
        user.password,
        await User.encryptPassword(password)
      ))
        ? res.status(200).json({ username, email: user.email })
        : res.json({ error: "Invalid password" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
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
    res.status(201).json({ token: generateSignUpToken(user._id) });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function createAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, email, adminPassword } = req.body;
    if (adminPassword === process.env.CREATE_ADMIN_PASSWORD) {
      const adminRole = await Role.findOne({ name: "Admin" });
      const admin = await new User({
        username,
        email,
        //we don't need the await in this call but an error detects it as promise even if it is not
        password: await User.encryptPassword(password),
        roles: [adminRole?._id],
      }).save();

      res.status(201).json({ token: generateSignUpToken(admin._id) });
    }
    res.json({error:'Admin access password invalid'})
  } catch (error) {
    res.status(400).json({ error });
  }
}
