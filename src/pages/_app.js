import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import AuthGuard from "../components/Auth";
import Layout from "../components/Layout";
import { TailwindIndicator } from "../components/tailwindcss-indicator";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SessionProvider session={pageProps.session}>
          <Layout>
            {Component.withAuth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
          <ReactQueryDevtools />
          <TailwindIndicator />
        </SessionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
