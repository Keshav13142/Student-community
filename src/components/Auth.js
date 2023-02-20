import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "./Loader";

// Component that wraps the pages that need to be protected
function Auth({ children }) {
  const router = useRouter();

  // The required flag forces the session to have just 'loading' or 'authenticated' staus
  const session = useSession({
    required: true,
    //Function to run when the session is unauthenticated
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  if (session?.status === "authenticated") {
    return children;
  }

  return <Loader />;
}

export default Auth;
