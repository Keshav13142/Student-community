import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </ChakraProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: false });

  const router = useRouter();

  if (status === "authenticated") {
    return children;
  }

  if (status === "loading" || !status) {
    return <Loader />;
  }

  router.push("/");
}
