import { combineReducers } from "@reduxjs/toolkit";
import bugsReducer from "./bugs";

export default combineReducers({ bugs: bugsReducer });
