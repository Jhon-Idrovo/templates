import { getAlbums, loadAlbums } from "../store/entities/albums";
import store from "../store/configureStore";
import { getUser, IUser, logIn } from "../store/auth/user";
import MockAdapter from "axios-mock-adapter";
import { LOG_IN_ENDPOINT, USER_SERVER_RESPONSE } from "../config/config";
import axiosInstance from "../config/axiosInstance";

// UNIT TESTS
describe("User", () => {
  let fakeAxios: MockAdapter;
  beforeEach(() => {
    fakeAxios = new MockAdapter(axiosInstance);
  });
  test("should log in user", async () => {
    // change the HTTP method for real use
    fakeAxios.onGet(LOG_IN_ENDPOINT).reply(200, USER_SERVER_RESPONSE);
    // log in is an async function
    await store.dispatch(logIn("TestUser", "TestPassword"));
    const state = store.getState();
    const user = getUser(state);
    console.log(state);

    expect(user).toStrictEqual({
      ...USER_SERVER_RESPONSE,
      loading: false,
      error: "",
    } as IUser);
  });
});

// // INTEGRATION TESTS
// describe("User", () => {
//   test("should log in user", async () => {
//     await store.dispatch(logIn("TestUser", "TestPassword"));
//     const state = store.getState();
//     const user = getUser(state);

//     expect(user.id).toBeTruthy();
//   });
// });

// describe("albums with user", () => {
//   test("should load albums", async () => {
//     await store.dispatch(loadAlbums());
//     const albums = getAlbums(store.getState());
//     console.log(albums);
//     expect(albums.list.length).toBeGreaterThan(0);
//   });
// });
