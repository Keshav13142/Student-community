import prisma from "@/lib/prisma";
import RenderMarkdown from "@/src/components/render-markdown";
import { Avatar, Button } from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoChevronBack } from "react-icons/io5";
import { authOptions } from "../../api/auth/[...nextauth]";

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
          id: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
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

  if (!post) {
    return {
      redirect: {
        destination: "/blog",
        permanent: false,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

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
  const router = useRouter();

  const PostComments = dynamic(
    () => import("../../../components/post-comments"),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.content.slice(0, 20)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex flex-col gap-10 p-5 xl:p-10">
        <Button
          variant="link"
          leftIcon={<IoChevronBack />}
          className="w-fit"
          onClick={() => {
            router.push("/blog");
          }}
        >
          Back to all posts
        </Button>
        <div className="flex w-[90vw] max-w-[90vw] flex-col gap-5 self-center md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
          <time
            dateTime={new Date(post.createdAt)}
            className="font-mono text-slate-700 dark:text-slate-400"
          >
            {format(new Date(post.createdAt), "EEEE, LLLL d, yyyy")}
          </time>
          <h1 className="text-xl font-medium dark:text-slate-300 lg:text-2xl xl:text-4xl">
            {post.title}
          </h1>
          <Link
            href={`/user/${post.author.username}`}
            className="flex w-fit items-center gap-3"
          >
            <Avatar src={post.author.image} name={post.author.name} />
            <div className="flex flex-col gap-1">
              <p className="font-medium text-slate-900 dark:text-slate-300">
                {post.author.name}
              </p>
              <p className="text-purple-500 hover:text-purple-600 dark:text-slate-500">
                @{post.author.username}
              </p>
            </div>
          </Link>
          {post.bannerImage !== "" && post.bannerImage !== null && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.bannerImage}
                alt={"Blog banner image"}
                className="block w-full rounded-md"
              />
            </>
          )}
        </div>
        <div className="w-[90vw] max-w-[90vw] self-center rounded-lg border-2 border-slate-200 dark:border-slate-700 md:w-[70vw] lg:w-[60vw] xl:w-[50vw]" />
        <article className="prose w-[90vw]  max-w-[90vw] self-center dark:prose-invert md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
          <RenderMarkdown content={post.content} />
        </article>
        <div className="w-[90vw] max-w-[90vw] self-center rounded-lg border-2 border-slate-200 dark:border-slate-700 md:w-[70vw] lg:w-[60vw] xl:w-[50vw]" />
        <PostComments post={post} />
      </div>
    </>
  );
};

SinglePost.withLayout = { showCommunityInfo: false };

export default SinglePost;
