import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
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

// Component that wraps the pages that need to be protected
function Auth({ children }) {
  const router = useRouter();

  // The required flag forces the session to have just 'loading' or 'authenticated' staus
  const { status } = useSession({
    required: true,
    //Function to run when the session is unauthenticated
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  if (status === "authenticated") {
    return children;
  }

  return <Loader />;
}
