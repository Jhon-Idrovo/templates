import { createSlice } from "@reduxjs/toolkit";
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
}
export const initialBugsState = {} as IBugs;

const bugsSlice = createSlice({
  name: "bugs",
  initialState: initialBugsState,
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRecieved: (bugs, action) => {
      bugs.list = action.payload.bugsList;
      bugs.loading = false;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
  },
});

export const { bugsRecieved, bugsRequested, bugsRequestFailed } =
  bugsSlice.actions;
export default bugsSlice.reducer;
// ACTION GENERATORS
export const loadBugs: any = () =>
  apiCallBegan({
    url: "/bugs",
    data: {},
    method: "POST",
    onStart: bugsRequested.type,
    onSuccess: bugsRecieved.type,
    onError: bugsRequestFailed.type,
  });

// SELECTORS
export const getBugs = () => (state: RootState) => state;
