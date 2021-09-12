import Head from "next/head";
import { apiCallBegan } from "../store/api";

import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { getUser, logIn, logOut } from "../store/auth/user";

export default function Home() {
  const user = useAppSelector(getUser);

  const dispatch = useAppDispatch();
  return (
    <>
      <Head>
        <title>Trivia App</title>
      </Head>

      <section className="game-board">
        <div className="">{}</div>
        <div>Name:{user.name}</div>
        <button onClick={() => dispatch(logIn({ name: "Jhon", id: "1" }))}>
          Log In
        </button>
        <button onClick={() => dispatch(logOut())}>Log Out</button>
        <button
          onClick={() =>
            dispatch(
              apiCallBegan({
                url: "/kjl",
                method: "POST",
                data: {},
              })
            )
          }
        >
          Api Call
        </button>
      </section>
    </>
  );
}
