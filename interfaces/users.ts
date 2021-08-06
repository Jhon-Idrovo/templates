import { Model } from "mongoose";
export declare interface UserIfc {
  username: string;
  password: string;
  email: string;
  roles: [{ name: string; _id: string }];
  comparePassword: Function;
}

export declare interface UserModel extends Model<UserIfc> {
  encryptPassword(password: string): string;
}
