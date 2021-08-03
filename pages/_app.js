import Head from "next/head";

import "../styles/global.css";
import NavBar from "../components/NavBar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
