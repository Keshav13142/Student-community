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
        <main className="flex lg:mx-5 gap-10 justify-center pt-10 px-5 sm:px-20 md:px-32 flex-col lg:flex-row">
          {/* md:order-2 */}
          <div className="flex flex-col gap-3 min-w-[50%] order-2 lg:order-1">
            {posts.map((p, idx) => (
              <div
                className="flex px-4 py-2 border rounded-lg border-slate-300 justify-between items-center"
                key={idx}>
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
                    className="flex flex-col gap-1 md:gap-2 lg:gap-3 mb-2">
                    <h2 className="text-lg md:text-2xl font-medium text-slate-900">
                      {p.title}
                    </h2>
                    <h3 className="text-base text-gray-500 max-w-sm line-clamp-2">
                      {p.content}
                    </h3>
                  </Link>
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-500 text-xs lg:text-sm">
                      {format(new Date(p.createdAt), "MMM d")}
                    </span>
                    <div className="flex gap-1 items-center">
                      {p.categories.slice(0, 2).map((c) => (
                        <div
                          key={c.id}
                          className="px-2 py-0.5 bg-gray-100 rounded-xl text-xs lg:text-sm text-violet-500 font-medium">
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
                    className="rounded-md object-cover aspect-video w-32 h-24 md:w-36 md:h-28 lg:w-40 lg:h-32"
                    alt={p.title}
                  />
                </Link>
              </div>
            ))}
          </div>
          {/* md:order-1 */}
          <div className="px-2 py-2 items-center flex flex-col gap-5 lg:sticky lg:top-24 h-fit order-1 lg:order-2">
            <h2 className="text-xl font-medium text-slate-900 text-center">
              Explore more posts by categories
            </h2>
            <div className="flex gap-1 items-center flex-wrap justify-evenly">
              {categories.map((c) => (
                <Link
                  href={`/blog?category=${c.name}`}
                  key={c.id}
                  className="p-1 rounded-xl border border-purple-300 min-w-[30%] text-center">
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
