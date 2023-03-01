import { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "@component/context";
import { NotificationsProvider } from "@mantine/notifications";
import {
  ganacheLocalhost,
  hardhatLocalhost,
} from "@component/constants/activeChainConfig";
import Head from "next/head";
import Layout from "@component/components/Layout";

export default function App(props) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const toggleColorScheme = (value) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Decentralized Auction</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme, loader: "bars" }}
        >
          <NotificationsProvider>
            <ThirdwebProvider activeChain={ganacheLocalhost}>
              <StateContextProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </StateContextProvider>
            </ThirdwebProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
