import { model, Schema, Types } from "mongoose";
import { TokenInterface } from "../../interfaces/token";

const refreshTokenSchema = new Schema<TokenInterface>({
  token: String,
  //this could be a reference either
  //if unique, the user wouldn't be able to login in multiple devices
  userID: { type: Types.ObjectId, unique: false },
});

export default model<TokenInterface>("RefreshToken", refreshTokenSchema);
