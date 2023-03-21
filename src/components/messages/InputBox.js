import { sendMessage } from "@/lib/api-calls/messages";
import { IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { io } from "socket.io-client";

let socket;

const MessageInputBox = ({ isDisabled, slug }) => {
  const [input, setInput] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const mutation = useMutation(sendMessage, {
    onError: () => {
      toast({
        title: "Failed to send message😢",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (mutation.isLoading) return;
    if (input.trim() !== "") {
      setInput("");
      socket.emit(`community-${slug}`, {
        content: input,
        sender: {
          id: session.data?.user?.id,
          username: session.data?.user?.username,
        },
        createdAt: new Date(),
      });
      mutation.mutate({ slug, content: input });
    }
  };

  useEffect(() => {
    if (slug) {
      // connect to socket server
      socket = io(process.env.NEXT_PUBLIC_MESSAGE_SOCKET_SERVER_URL, {
        withCredentials: true,
      });

      // log socket connection
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!");
      });

      // update chat on new message dispatched
      socket.on(`community-${slug}`, (data) => {
        queryClient.setQueryData(["messages", slug], (prev) => [...prev, data]);
      });
    }

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, [slug]);

  return (
    <form onSubmit={handleMessageSend}>
      <Tooltip
        isDisabled={!isDisabled}
        label={
          "You have to be a member to send messages in RESTRICTED communities"
        }
        hasArrow
      >
        <div className="flex gap-5 p-3">
          <Input
            disabled={isDisabled}
            value={input}
            placeholder="Send a message"
            borderWidth={2}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <IconButton isDisabled={isDisabled} icon={<BiSend />} type="submit" />
        </div>
      </Tooltip>
    </form>
  );
};

export default MessageInputBox;
