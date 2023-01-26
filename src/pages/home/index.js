import prisma from "@/lib/prisma";
import { Button } from "@chakra-ui/react";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let communities = await prisma.community.findMany({
    where: {
      institution: {
        members: {
          some: {
            id: session?.data?.user.id,
          },
        },
      },
    },
  });

  return {
    props: {
      communities,
    }, // will be passed to the page component as props
  };
};

const Home = ({ communities }) => {
  console.log(communities);
  return (
    <div>
      Home
      <Button
        onClick={() => {
          signOut({ callbackUrl: "/", redirect: false });
        }}>
        Sign out
      </Button>
    </div>
  );
};

Home.auth = true;

export default Home;
