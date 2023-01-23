import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Avatar, Button, Loader } from "rsuite";

export default function Home() {
  const session = useSession();

  if (session.status === "unauthenticated" || session.status === "loading") {
    return (
      <>
        <Head>
          <title>Student community</title>
          <meta
            name="description"
            content="Platform for students within institutions to interact"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen w-screen">
          <div className="flex flex-col gap-5 items-center justify-center h-full">
            {session.status === "loading" ? (
              <Loader size="lg" content="" />
            ) : (
              <>
                <span>(Github only works in dev cause of callback url)</span>
                <Button
                  appearance="primary"
                  size="lg"
                  className="w-fit"
                  onClick={async () => {
                    await signIn("github");
                  }}>
                  Login with GitHub
                </Button>
                <Button
                  appearance="ghost"
                  size="lg"
                  className="w-fit"
                  onClick={async () => {
                    await signIn("discord");
                  }}>
                  Login with Discord
                </Button>
              </>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Student community</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <div className="flex flex-col gap-5 items-center justify-center h-full">
          <Avatar size="lg" src={session.data.user.image} />
          <h1 className="text-2xl">Name : {session.data.user.name}</h1>
          <h2 className="text-xl">Email : {session.data.user.email}</h2>
          <Button
            appearance="primary"
            size="lg"
            className="w-fit"
            onClick={async () => {
              await signOut();
            }}>
            Logout
          </Button>
        </div>
      </main>
    </>
  );
}
