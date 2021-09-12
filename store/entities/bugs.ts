import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "hoist-non-react-statics/node_modules/@types/react";
import { BUGS_CACHING_TIMEOUT } from "../../config/config";
import { RootState } from "../configureStore";
import { apiCallBegan } from "../middleware/api";

export declare interface IBug {
  id: string;
  description: string;
}

export declare interface IBugs {
  list: IBug[];
  loading: boolean;
  error: string;
  lastFetch: number;
}
export const initialBugsState = {} as IBugs;
export declare interface IBugsServerResponse {
  bugsList: IBug[];
}
const bugsSlice = createSlice({
  name: "bugs",
  initialState: initialBugsState,
  reducers: {
    bugsRequested: (bugs) => {
      bugs.loading = true;
    },
    bugsRecieved: (bugs, action: PayloadAction<IBugsServerResponse>) => {
      bugs.loading = false;
      bugs.lastFetch = Date.now();

      const { bugsList } = action.payload;
      bugs.list = bugsList;
    },
    bugsRequestFailed: (bugs) => {
      bugs.loading = false;
    },
    bugsUseCached: (bugs) => bugs,
  },
});

export const { bugsRecieved, bugsRequested, bugsRequestFailed, bugsUseCached } =
  bugsSlice.actions;
export default bugsSlice.reducer;
// FUNCTION ACTIONS
export const loadBugs: any =
  () => (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    // set state to loading
    dispatch(bugsRequested);
    const { lastFetch } = getState().entities.bugs;
    if (lastFetch + BUGS_CACHING_TIMEOUT > Date.now())
      return dispatch(bugsUseCached);
    dispatch(
      apiCallBegan({
        url: "/bugs",
        data: {},
        method: "POST",
        onSuccess: bugsRecieved.type,
        onError: bugsRequestFailed.type,
      })
    );
  };
// SELECTORS
export const getBugs = () => (state: RootState) => state.entities.bugs;
