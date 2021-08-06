import { model, Schema, Types } from "mongoose";
import { RefreshTokenInterface } from "../../interfaces/token";

const refreshTokenSchema = new Schema<RefreshTokenInterface>({
  token: String,
  //this could be a reference either
  userID: Types.ObjectId,
});

export default model<RefreshTokenInterface>("RefreshToken", refreshTokenSchema);
