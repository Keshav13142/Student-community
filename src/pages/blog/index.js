import prisma from "@/lib/prisma";
import { Button, IconButton } from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { BsNewspaper } from "react-icons/bs";
import { MdClear } from "react-icons/md";
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

  const categories = await prisma.category.findMany({});

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      institution: {
        members: {
          some: {
            user: {
              id: user.id,
            },
          },
        },
      },
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
      <div>
        <div className="flex flex-col justify-center gap-10 py-10 px-5 sm:px-20 md:px-32 lg:flex-row lg:px-40">
          <div className="order-2 flex min-w-[80%] flex-col gap-3 md:min-w-[65%] lg:order-1 lg:min-w-[75%] xl:min-w-[60%]">
            {posts.length > 0 ? (
              posts.map((p, idx) => (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-300 px-4 py-2"
                  key={idx}
                >
                  <div className="max-w-[60%] grow md:max-w-[70%]">
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
                      className="mb-2 flex flex-col gap-1 md:gap-2 lg:gap-3"
                    >
                      <h2 className="text-lg font-medium text-slate-900 md:text-xl lg:text-2xl">
                        {p.title}
                      </h2>
                      <h3 className="text-sm text-gray-500 line-clamp-2 md:max-w-xs xl:text-base">
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
                            className="rounded-xl bg-gray-100 px-2 py-0.5 text-xs font-medium text-violet-500 lg:text-sm"
                          >
                            {c.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href={`/blog/${p.slug}`}>
                    {p.bannerImage === "" || !p.bannerImage ? (
                      <Image
                        src="https://cdn-icons-png.flaticon.com/512/3875/3875148.png"
                        className="object-cover"
                        height="96"
                        width="128"
                        alt="No img"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.bannerImage}
                        className="aspect-video h-24 w-32 rounded-md object-cover"
                        alt={p.title}
                      />
                    )}
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2680/2680927.png"
                  className="max-w-[20%]"
                  alt="no posts"
                />
                <h2 className="text-2xl font-medium">No posts found</h2>
                <Link href="/blog/new">
                  <Button
                    variant="outline"
                    colorScheme="purple"
                    leftIcon={<BsNewspaper />}
                  >
                    Create a new post
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="order-1 flex h-fit min-w-[35%] flex-col items-center gap-5 p-2 lg:sticky lg:top-24 lg:order-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium text-slate-900">
                Discover by categories
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
            <div className="flex flex-wrap items-center justify-evenly gap-1 gap-y-2">
              {categories.map((c) => (
                <Link
                  href={`/blog?category=${c.name}`}
                  key={c.id}
                  className="min-w-[30%] rounded-xl border border-purple-300 p-1 text-center"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <Link href="/blog/new">
              <Button
                variant="outline"
                colorScheme="purple"
                leftIcon={<BsNewspaper />}
              >
                Create a new post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

Blog.withLayout = { showCommunityInfo: false };

export default Blog;
