import { JwtPayload } from "jsonwebtoken";
import { RoleName } from "./roles";

//for the model
export declare interface TokenInterface {
  token: string;
  userID: string;
}

//for the payload being sent into the token
export declare interface TokenPayloadInterface extends JwtPayload {
  token: string;
  userID: string;
  roles: RoleName[];
}
