import Head from "next/head";
import { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import Layout from "@component/components/Layout";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "@component/context";

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

  const ganacheLocalhost = {
    name: "Ganache Localhost",
    chain: "ETH",
    rpc: ["http://172.24.144.1:7545"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    chainId: 1337,
    networkId: 5777,
    testnet: true,
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
          theme={{ colorScheme }}
        >
          <ThirdwebProvider activeChain={ganacheLocalhost}>
            <StateContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </StateContextProvider>
          </ThirdwebProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
