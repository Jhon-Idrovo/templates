import { model, Schema, Types } from "mongoose";
import { TokenInterface } from "../../interfaces/token";

const refreshTokenSchema = new Schema<TokenInterface>({
  token: String,
  //this could be a reference either
  userID: Types.ObjectId,
});

export default model<TokenInterface>("RefreshToken", refreshTokenSchema);
