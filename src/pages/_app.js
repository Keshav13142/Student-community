import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Auth from "../components/Auth";
import Layout from "../components/Layout";
import { AppContextProvider } from "../context/AppContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <AppContextProvider>
          {/* Wrap the components in Layout */}
          <Layout>
            {/* If the components have the auth property set to true, then protect them */}
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
        </AppContextProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
