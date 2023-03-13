import prisma from "@/lib/prisma";
import { Button, IconButton, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { BsNewspaper } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import Navbar from "../../components/Layout/navbar";
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
      ...(query.category
        ? {
            categories: {
              some: {
                name: query.category,
              },
            },
          }
        : {}),
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
    orderBy: {
      createdAt: "desc",
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
        <main className="flex flex-col justify-center gap-10 py-10 px-5 sm:px-20 md:px-32 lg:mx-5 lg:flex-row">
          {/* md:order-2 */}
          <div className="order-2 flex min-w-[50%] flex-col gap-3 lg:order-1">
            {posts.map((p, idx) => (
              <div
                className="flex items-center justify-between rounded-lg border border-slate-300 px-4 py-2"
                key={idx}>
                <div className="grow">
                  <div className="mb-1 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.author.image}
                      alt={p.author.image}
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="">{p.author.name}</span>
                  </div>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="mb-2 flex flex-col gap-1 md:gap-2 lg:gap-3">
                    <h2 className="text-lg font-medium text-slate-900 md:text-2xl">
                      {p.title}
                    </h2>
                    <h3 className="max-w-sm text-base text-gray-500 line-clamp-2">
                      {p.content}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 lg:text-sm">
                      {format(new Date(p.createdAt), "MMM d")}
                    </span>
                    <div className="flex items-center gap-1">
                      {p.categories.slice(0, 2).map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl bg-gray-100 px-2 py-0.5 text-xs font-medium text-violet-500 lg:text-sm">
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
                    className="aspect-video h-24 w-32 rounded-md object-cover md:h-28 md:w-36 lg:h-32 lg:w-40"
                    alt={p.title}
                  />
                </Link>
              </div>
            ))}
          </div>
          {/* md:order-1 */}
          <div className="order-1 flex h-fit flex-col items-center gap-5 p-2 lg:sticky lg:top-24 lg:order-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium text-slate-900">
                Explore more posts by categories
              </h2>
              <Link href="/blog">
                <IconButton
                  icon={<MdClear />}
                  size="xs"
                  color="red"
                  variant="outline"
                />
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-evenly gap-1">
              {categories.map((c) => (
                <Link
                  href={`/blog?category=${c.name}`}
                  key={c.id}
                  className="min-w-[30%] rounded-xl border border-purple-300 p-1 text-center">
                  {c.name}
                </Link>
              ))}
            </div>
            <Link href="/blog/new">
              <Button
                variant="outline"
                colorScheme="purple"
                leftIcon={<BsNewspaper />}>
                Create a new post
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
