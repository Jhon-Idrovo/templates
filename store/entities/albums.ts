import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import { BUGS_CACHING_TIMEOUT } from "../../config/config";
import { RootState } from "../configureStore";
import { AppThunk } from "../middleware/thunkMiddleware";

export declare interface IAlbum {
  id: number;
  title: string;
}
export declare interface IAlbumsSlice {
  loading: boolean;
  list: IAlbum[];
  lastFetch: number;
  errorMsg: string;
}
export declare type IAlbumsResponse = IAlbum[];
export const initialAlbumsState: IAlbumsSlice = {
  loading: false,
  list: [],
  lastFetch: 0,
  errorMsg: "",
};
const albumsSlice = createSlice({
  name: "albums",
  initialState: initialAlbumsState,
  reducers: {
    loading: (albums) => ({ ...albums, loading: true }),
    fetchSucceeded: (albums, action: PayloadAction<IAlbumsResponse>) => ({
      ...albums,
      list: action.payload,
      loading: false,
      errorMsg: "",
      lastFetch: Date.now(),
    }),
    fetchFailed: (albums, action: PayloadAction<string>) => ({
      ...albums,
      loading: false,
      errorMsg: action.payload,
    }),
    useCached: (albums) => ({ ...albums, loading: false }),
  },
});

const { loading, fetchFailed, fetchSucceeded, useCached } = albumsSlice.actions;
export default albumsSlice.reducer;

// ACTION FUNCTIONS
export const loadAlbums = (): AppThunk => async (dispatch, getState) => {
  dispatch(loading());
  const state = getState() as RootState;
  const userId = state.auth.user.id;
  const lastFetch = state.entities.albums.lastFetch;
  // check cache time
  if (lastFetch + BUGS_CACHING_TIMEOUT > Date.now())
    return dispatch(useCached());
  if (!userId) return dispatch(fetchFailed("User not available"));
  try {
    const res = await axiosInstance.get(
      `https://jsonplaceholder.typicode.com/users/${userId}/albums`
    );

    return dispatch(fetchSucceeded(res.data));
  } catch (error) {
    console.log(error);
    return dispatch(
      fetchFailed((error as AxiosError).response?.data.error.message)
    );
  }
};

// SELECTORS
export const getAlbums = (state: RootState) => state.entities.albums;
