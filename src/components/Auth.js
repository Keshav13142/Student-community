import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Loader from "./Loader";

const checkIfAdmin = async () => {
  const response = await fetch("/api/user/is-admin");

  if (response.ok) {
    const { isAdmin } = await response.json();
    return isAdmin;
  }
  return null;
};

// Component that wraps the pages that need to be protected
function Auth({ children }) {
  const router = useRouter();

  const { setCurrentUser, setIsInstitutionAdmin } = useContext(AppContext);

  // The required flag forces the session to have just 'loading' or 'authenticated' staus
  const session = useSession({
    required: true,
    //Function to run when the session is unauthenticated
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    if (session?.data?.user) {
      setCurrentUser(session.data.user);
      (async () => {
        setIsInstitutionAdmin(await checkIfAdmin());
      })();
    }
  }, [session, setCurrentUser, setIsInstitutionAdmin]);

  if (session?.status === "authenticated") {
    return children;
  }

  return <Loader />;
}

export default Auth;
