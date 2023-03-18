import { sendComment } from "@/lib/api-calls/posts";
import prisma from "@/lib/prisma";
import RenderMarkdown from "@/src/components/render-markdown";
import { Avatar, Button, IconButton, Input, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiSend } from "react-icons/bi";
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
  const [input, setInput] = useState("");
  const toast = useToast();
  const [comments, setComments] = useState(post.postComments);

  const mutation = useMutation(sendComment, {
    onError: () => {
      toast({
        title: "Failed to send message😢",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      setInput("");
      toast({
        title: "Comment sent",
        status: "success",
        duration: 1200,
        isClosable: true,
      });
      setComments((p) => [...p, data]);
    },
  });

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (mutation.isLoading) return;
    if (input.trim() !== "") {
      mutation.mutate({ slug: post.slug, comment: input });
    }
  };

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
          All posts
        </Button>
        <div className="flex w-[90%] flex-col gap-5 self-center sm:w-[80%] lg:w-[55%]">
          <time
            dateTime={new Date(post.createdAt)}
            className="font-mono text-slate-700"
          >
            {format(new Date(post.createdAt), "EEEE, LLLL d, yyyy")}
          </time>
          <h1 className="text-xl font-medium lg:text-2xl xl:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
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
        <div className="w-[95%] self-center rounded-lg border-2 border-gray-200 sm:w-[80%] lg:w-[55%]" />
        <article className="prose max-w-[90vw] self-center">
          <RenderMarkdown content={post.content} />
        </article>
        <div className="w-[95%] self-center rounded-lg border-2 border-gray-200 sm:w-[80%] lg:w-[55%]" />
        <div className="flex  w-[100%] flex-col gap-5 self-center sm:w-[70%] lg:w-[55%]">
          <h2 className="text-2xl font-medium underline">Comments</h2>
          <div className="flex max-h-[20vh] flex-col gap-2 overflow-y-auto">
            {comments.map((m) => (
              <div
                key={m.id}
                className="flex w-fit min-w-[20%] flex-col rounded-lg bg-gray-200 px-2 py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-500">
                    {m.user ? m.user.username : "[deleted]"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(m.createdAt), "do MMMM")}
                  </span>
                </div>
                <span>{m.comment}</span>
              </div>
            ))}
          </div>
          <form className="flex gap-3" onSubmit={handleSendComment}>
            <Input
              value={input}
              placeholder="Send a message"
              borderWidth={2}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <IconButton
              isDisabled={mutation.isLoading}
              icon={<BiSend />}
              type="submit"
            />
          </form>
        </div>
      </div>
    </>
  );
};

SinglePost.withLayout = { showCommunityInfo: false };

export default SinglePost;
