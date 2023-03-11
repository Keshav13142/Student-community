import prisma from "@/lib/prisma";
import { Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Navbar from "../../components/Layout/navbar";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user } = session;

  const institutionFilter = {
    OR: [
      { members: { some: { id: user.id } } },
      { admins: { some: { id: user.id } } },
    ],
  };

  const categories = await prisma.category.findMany({});

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      institution: institutionFilter,
    },
    select: {
      id: true,
      slug: true,
      bannerImage: true,
      createdAt: true,
      categories: true,
      content: true,
      title: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return {
    props: {
      posts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
      })),
      categories,
    },
  };
}

const Blog = ({ posts, categories }) => {
  return (
    <>
      <Head>
        <title>Blogs</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
        {/* md:flex-col justify-start */}
        <main className="flex sm:gap-10 xl:gap-20 justify-center pt-10 px-10">
          {/* md:order-2 */}
          <div className="min-w-[45%] flex flex-col gap-5">
            {posts.map((p) => (
              <div
                className="px-4 py-2 flex justify-between items-center border rounded-lg border-slate-300 gap-3"
                key={p.id}>
                <div className="flex-grow">
                  <div className="flex gap-2 items-center mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.author.image}
                      alt={p.author.image}
                      className="rounded-full w-5 h-5"
                    />
                    <span className="">{p.author.name}</span>
                  </div>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="flex flex-col gap-3 mb-2">
                    <h2 className="text-2xl font-medium text-slate-900">
                      {p.title}
                    </h2>
                    <h3 className="text-base text-gray-500 max-w-sm line-clamp-2">
                      {p.content}
                    </h3>
                  </Link>
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-500 text-sm">
                      {format(new Date(p.createdAt), "MMM d")}
                    </span>
                    <div className="flex gap-2 items-center">
                      {p.categories.slice(0, 2).map((c) => (
                        <div
                          key={c.id}
                          className="px-2 py-0.5 bg-gray-100 rounded-xl text-sm text-violet-500 font-medium">
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href={`/blog/${p.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.bannerImage}
                    className="w-60 rounded-md object-cover aspect-video h-40"
                    alt={p.title}
                  />
                </Link>
              </div>
            ))}
          </div>
          {/* md:order-1 */}
          <div className="px-5 py-2 items-center flex flex-col gap-3 sticky top-24 h-fit">
            <h2 className="text-xl font-medium text-slate-900">
              Explore more posts by categories
            </h2>
            <div className="flex gap-2 items-center flex-wrap justify-evenly">
              {categories.map((c) => (
                <Link
                  href={`/blog?category=${c.name}`}
                  key={c.id}
                  className="px-2 py-1 rounded-xl border border-purple-300 min-w-[30%] text-center">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
