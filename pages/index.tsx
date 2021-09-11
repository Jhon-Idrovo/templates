import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../store/user";
export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
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
      </section>
    </>
  );
}
