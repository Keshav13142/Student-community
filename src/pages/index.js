import { Button } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { GoMarkGithub } from "react-icons/go";
import { SiDiscord } from "react-icons/si";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user) {
    return {
      redirect: {
        destination: "/home",
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

export default function Home() {
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
      <main className="h-screen w-screen flex flex-col max-w-3xl m-auto justify-center gap-5 items-center">
        <h1 className="font-extrabold text-4xl">
          Student <span className=" text-purple-600">Community</span> Platform
        </h1>
        <h2 className="text-2xl">
          Helping students stay connected within campus
        </h2>
        <h3 className="text-xl mt-5 font-medium">Get started now..</h3>
        <div className="flex gap-5">
          <Button
            variant={"outline"}
            colorScheme="purple"
            leftIcon={<GoMarkGithub size={20} />}
            size="lg"
            onClick={async () => {
              await signIn("github");
            }}>
            Login with GitHub
          </Button>
          <Button
            variant={"outline"}
            colorScheme="purple"
            leftIcon={<SiDiscord />}
            size="lg"
            onClick={async () => {
              await signIn("discord");
            }}>
            Login with Discord
          </Button>
        </div>
      </main>
    </>
  );
}
