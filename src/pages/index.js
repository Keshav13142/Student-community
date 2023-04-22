import { Button, useColorMode } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { GoMarkGithub } from "react-icons/go";
import { MdDarkMode } from "react-icons/md";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user) {
    return {
      redirect: {
        destination: "/discover",
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
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="flex h-screen w-screen flex-col dark:bg-slate-900">
      <Button
        className="mt-5 mr-5 flex w-fit items-center gap-2 self-end"
        size="sm"
        variant="outline"
        colorScheme="facebook"
        onClick={toggleColorMode}
      >
        {colorMode === "light" ? (
          <>
            <MdDarkMode />
          </>
        ) : (
          <>
            <BsFillSunFill />
          </>
        )}
      </Button>
      <div className="mx-3 flex grow flex-col items-center justify-center gap-5 text-center">
        <h1 className="text-2xl font-extrabold md:text-4xl">
          Student <span className=" text-purple-600">Community</span> Platform
        </h1>
        <p className="max-w-sm text-center text-lg font-medium text-slate-600 dark:text-slate-400 md:max-w-md md:text-2xl lg:max-w-lg xl:max-w-xl">
          This platform aims to help students stay connected within campus, and
          also allow the institution to moderate and manage communities
          effectively.
        </p>
        <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
          Get started now..
        </p>
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
      <footer className="mx-5 mb-5 flex flex-col items-center justify-center gap-2 text-center text-xs font-medium text-gray-400 md:flex-row">
        <p>
          Student Community is open source on{" "}
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
        <p>
          Illustrations by{" "}
          <Link
            href="https://popsy.co/illustrations"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 underline underline-offset-4"
          >
            Popsy
          </Link>{" "}
          and{" "}
          <Link
            href="https://doodleipsum.com/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 underline underline-offset-4"
          >
            Doodle Ipsum
          </Link>
        </p>
      </footer>
    </div>
  );
}
