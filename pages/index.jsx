import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Card from "../components/Card";

export default function Home() {
  const images = [
    {
      url:
        "https://assets.website-files.com/5faabe4b6f6b4331a5f27952/603fa29994675e4e5487a831_Hero_Original-min-p-500.png",
      desc: "description",
    },
  ];
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
