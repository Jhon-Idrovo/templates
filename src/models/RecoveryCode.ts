import { model, Schema } from "mongoose";
import { RecoveryCode } from "./interfaces/recoveryCode";

const recoverySchema = new Schema<RecoveryCode>({
  code: String,
  iat: Number,
  userId: { ref: "User", type: Schema.Types.ObjectId },
});

export default model<RecoveryCode>("RecoveryCode", recoverySchema);
