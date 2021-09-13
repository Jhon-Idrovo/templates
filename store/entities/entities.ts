import { combineReducers } from "@reduxjs/toolkit";
import albumsReducer from "./albums";

export default combineReducers({ albums: albumsReducer });
