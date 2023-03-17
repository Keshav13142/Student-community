import { Button } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { GoMarkGithub } from "react-icons/go";
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
      <div className="flex h-screen w-screen flex-col">
        <main className="mx-3 flex grow flex-col items-center justify-center gap-5 text-center">
          <h1 className="text-2xl font-extrabold md:text-4xl">
            Student <span className=" text-purple-600">Community</span> Platform
          </h1>
          <p className="max-w-xl text-center text-xl text-slate-500 md:text-2xl">
            This platform aims to help students stay connected within campus,
            and also allow the institution to moderate and manage communities
            effectively.
          </p>
          <p className="mt-5 text-xl font-semibold text-slate-600">
            Get started now..
          </p>
          <div className="flex gap-5">
            <Button
              variant={"outline"}
              colorScheme="purple"
              leftIcon={<GoMarkGithub size={20} />}
              size={["md", "lg"]}
              isLoading={isGithubLoading}
              onClick={async () => {
                setIsGithubLoading(true);
                await signIn("github");
              }}
            >
              Login with GitHub
            </Button>
          </div>
        </main>
        <footer className="mb-5">
          <p className="text-center text-xs font-medium text-gray-400">
            Student Community is open source and powered by open source
            software. The code is available on{" "}
            <Link
              href="https://github.com/Keshav13142/Student-community"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </footer>
      </div>
    </>
  );
}
