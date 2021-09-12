import Head from "next/head";

import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { getUser, logIn } from "../store/auth/user";
import { loadBugs } from "../store/entities/bugs";

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
        <button onClick={() => dispatch(logIn("jhon", "lavacalola"))}>
          Log In
        </button>

        <button onClick={() => dispatch(loadBugs())}> Load Bugs</button>
      </section>
    </>
  );
}
