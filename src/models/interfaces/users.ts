import Joi from "joi";
import { Model } from "mongoose";
import { RoleName } from "./roles";
export const AUTH_METHODS = ["google", "facebook", "twitter", "built-in"];
export declare type AuthMethod = "google" | "facebook" | "twitter" | "built-in";
export declare interface UserIfc {
  authMethod: AuthMethod;
  authProviderId?: string;
  username: string;
  password: string;
  email: string;
  role: { name: RoleName; _id: string };
  comparePassword: Function;
}

export declare interface UserModel extends Model<UserIfc> {
  encryptPassword(password: string): string;
  joiValidate(user: UserIfc): Joi.ValidationResult;
}
