import { sendComment } from "@/lib/api-calls/posts";
import { IconButton, Input, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

const PostComments = ({ post }) => {
  const [comments, setComments] = useState(post.postComments);
  const [input, setInput] = useState("");
  const toast = useToast();

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
    <div className="flex  w-[100%] flex-col gap-5 self-center sm:w-[70%] lg:w-[55%]">
      <h2 className="text-2xl font-medium underline dark:text-slate-300">
        Comments
      </h2>
      <div className="flex max-h-[20vh] flex-col gap-2 overflow-y-auto">
        {comments.map((m) => (
          <div
            key={m.id}
            className="flex w-fit min-w-[20%] flex-col rounded-lg bg-slate-200 px-2 py-1 dark:bg-slate-700"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-500">
                {m.user ? m.user.username : "[deleted]"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
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
          size={["sm", "md"]}
          placeholder="Send a message"
          borderWidth={2}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <IconButton
          size={["sm", "md"]}
          isDisabled={mutation.isLoading}
          icon={<BiSend />}
          type="submit"
        />
      </form>
    </div>
  );
};

export default PostComments;
