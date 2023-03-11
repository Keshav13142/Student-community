import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "./Loader";

// Component that wraps the pages that need to be protected
function AuthGuard({ children }) {
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
    const { user } = session.data;
    if (user.hasProfile) {
      if (
        user.enrollmentStatus !== "APPROVED" &&
        router.pathname !== "/enrollment-status"
      )
        router.push("/enrollment-status");
    } else if (router.pathname !== "/auth/new-user")
      router.push("/auth/new-user");
    return children;
  }

  return <Loader />;
}

export default AuthGuard;
