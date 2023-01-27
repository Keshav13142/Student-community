import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { AppContextProvider } from "../context/AppContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ChakraProvider>
      <AppContextProvider>
        <SessionProvider session={session}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </AppContextProvider>
    </ChakraProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  if (status === "authenticated") {
    return children;
  }

  return <Loader />;
}
