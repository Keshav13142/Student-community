import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import { Stack } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Head from "next/head";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      slug: query.slug,
    },
    select: {
      slug: true,
      bannerImage: true,
      createdAt: true,
      categories: true,
      content: true,
      title: true,
      postComments: {
        select: {
          comment: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      author: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
    },
  });

  return {
    props: {
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        postComments: post.postComments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
      },
    },
  };
}

const SinglePost = ({ post }) => {
  console.log(post);
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.content.slice(0, 20)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Stack height="100vh">
        <Navbar />
        <div className="h-full">{post.title}</div>
      </Stack>
    </>
  );
};

export default SinglePost;
