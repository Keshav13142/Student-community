import { Button } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { SiDiscord } from "react-icons/si";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user) {
    return {
      redirect: {
        destination: "/community/discover",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function DiscoverCommunities() {
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Student community</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="m-auto flex h-screen w-screen max-w-3xl flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-extrabold">
          Student <span className=" text-purple-600">Community</span> Platform
        </h1>
        <h2 className="text-2xl">
          Helping students stay connected within campus
        </h2>
        <h3 className="mt-5 text-xl font-medium">Get started now..</h3>
        <div className="flex gap-5">
          <Button
            variant={"outline"}
            colorScheme="purple"
            isDisabled={isDiscordLoading}
            leftIcon={<GoMarkGithub size={20} />}
            size="lg"
            isLoading={isGithubLoading}
            onClick={async () => {
              setIsGithubLoading(true);
              await signIn("github");
            }}
          >
            Login with GitHub
          </Button>
          <Button
            variant={"outline"}
            colorScheme="purple"
            isDisabled={isGithubLoading}
            leftIcon={<SiDiscord />}
            size="lg"
            isLoading={isDiscordLoading}
            onClick={async () => {
              setIsDiscordLoading(true);
              await signIn("discord");
            }}
          >
            Login with Discord
          </Button>
        </div>
      </main>
    </>
  );
}
