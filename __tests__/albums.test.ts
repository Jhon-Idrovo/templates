import { getAlbums, loadAlbums } from "../store/entities/albums";
import store from "../store/configureStore";
import { getUser, logIn } from "../store/auth/user";

// INTEGRATION TESTS
describe("User", () => {
  test("should log in user", async () => {
    await store.dispatch(logIn("TestUser", "TestPassword"));
    const state = store.getState();
    const user = getUser(state);

    expect(user.id).toBeTruthy();
  });
});

describe("albums with user", () => {
  test("should load albums", async () => {
    await store.dispatch(loadAlbums());
    const albums = getAlbums(store.getState());
    console.log(albums);
    expect(albums.list.length).toBeGreaterThan(0);
  });
});
