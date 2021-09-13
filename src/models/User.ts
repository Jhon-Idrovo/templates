import { model, Schema } from "mongoose";
import joi from "joi";
import { AUTH_METHODS, UserIfc, UserModel } from "./interfaces/users";
import bcrypt from "bcryptjs";
const userSchema = new Schema<UserIfc, UserModel>({
  authMethod: String,
  authProviderId: { type: String, require: false },
  username: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { ref: "Role", type: Schema.Types.ObjectId, require: true },
});

/**
 *
 * @param password string with the password to be assigned
 * @returns string promise that resolves to an encrypted password
 */
userSchema.statics.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = bcrypt.hash(password, salt);
  return encryptedPassword;
};

/**
 *
 * @param savedPassword password saved in the db
 * @param tipedPassword password senden fron the client
 * @returns true if the passwords are the same, otherwise, false
 */
userSchema.methods.comparePassword = async (
  savedPassword: string,
  tipedPassword: string
) => {
  return await bcrypt.compare(tipedPassword, savedPassword);
};

userSchema.statics.joiValidate = (user: UserIfc) => {
  const joiSchema = joi.object({
    username: joi.string().min(8).max(30).required(),
    password: joi
      .string()
      .min(8)
      .max(30)
      .regex(/[a-zA-Z0-9]{8,30}/)
      .required(),
    email: joi.string().email().required(),
    authMethod: joi
      .string()
      .required()
      .allow(...AUTH_METHODS),
  });
  return joiSchema.validate(user);
};

export default model<UserIfc, UserModel>("User", userSchema);
