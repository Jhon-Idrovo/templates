import { combineReducers } from "redux";
import AuthReducer from "./auth/auth";

import entities from "./entities/entities";

export default combineReducers({
  auth: AuthReducer,
  entities: entities,
});
