import Head from "next/head";
import Card from "../components/Card";

export default function Home() {
  return (
    <>
      <Head>
        <title>Trivia App</title>
      </Head>

      <section className="game-board">
        <Card />
      </section>
    </>
  );
}
