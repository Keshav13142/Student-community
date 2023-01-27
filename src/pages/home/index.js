import prisma from "@/lib/prisma";
import Layout from "@/src/components/Layout";
import { unstable_getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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
      user: session?.user,
    },
  };
};

const Home = ({ communities, user }) => {
  return <Layout>Home</Layout>;
};

Home.auth = true;

export default Home;
