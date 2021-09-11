import Head from "next/head";

import "../styles/global.css";
import NavBar from "../components/NavBar";

// redux
import store from "../store/configureStore";
import { Provider } from "react-redux";
import { AppProps } from "next/dist/next-server/lib/router/router";
export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: AppProps;
}) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider store={store}>
        <NavBar />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
