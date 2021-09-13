import Head from "next/head";

import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { getUser, logIn, logOut } from "../store/auth/user";
import { getAlbums, loadAlbums } from "../store/entities/albums";

export default function Home() {
  const user = useAppSelector(getUser);
  const albums = useAppSelector(getAlbums);

  const dispatch = useAppDispatch();
  return (
    <>
      <Head>
        <title>Trivia App</title>
      </Head>

      <section className="game-board">
        <div className="">{}</div>
        <div>Name:{user.name}</div>
        <button onClick={() => dispatch(logIn("jhon", "lavacalola"))}>
          Log In
        </button>
        <button onClick={() => dispatch(logOut())}>Log Out</button>
        <button onClick={() => dispatch(loadAlbums())}>Press me </button>
        {albums?.list && albums.list.map(({ title }) => <div>{title}</div>)}
      </section>
    </>
  );
}
