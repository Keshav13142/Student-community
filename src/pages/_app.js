import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Auth from "../components/Auth";
import Layout from "../components/Layout";
import { AppContextProvider } from "../context/AppContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SessionProvider session={session}>
          {/* <AppContextProvider> */}
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
          {/* </AppContextProvider> */}
          <ReactQueryDevtools />
        </SessionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
