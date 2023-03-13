import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import { synthWave } from "@/src/theme";
import { Avatar, Button } from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
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
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.content.slice(0, 20)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen min-w-full">
        <Navbar />
        <div className="flex flex-col py-10 gap-10 px-10">
          <Button
            variant="link"
            leftIcon={<IoChevronBack />}
            className="w-fit"
            onClick={() => {
              router.back();
            }}>
            Go back
          </Button>
          <div className="self-center min-w-[50%] flex flex-col gap-5 border-b-4 border-b-slate-300 pb-10">
            <time
              dateTime={new Date(post.createdAt)}
              className="text-slate-700 font-mono">
              {format(new Date(post.createdAt), "EEEE, LLLL d, yyyy")}
            </time>
            <h1 className="text-4xl font-medium">{post.title}</h1>
            <div className="flex gap-3 items-center">
              <Avatar src={post.author.image} name={post.author.name} />
              <div className="flex flex-col gap-1">
                <p className="text-slate-900">{post.author.name}</p>
                <Link href={`/user/@${post.author.username}`}>
                  <p className="text-purple-500 hover:text-purple-600">
                    @{post.author.username}
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <article className="prose self-center max-w-[22rem] sm:max-w-xl md:max-w-2xl">
            <ReactMarkdown
              rehypePlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      wrapLines
                      style={synthWave}
                      showLineNumbers
                      language={match[1]}
                      PreTag="div"
                      {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}>
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
