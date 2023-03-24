import { sendMessage } from "@/lib/api-calls/messages";
import { socket } from "@/lib/socket-client";
import { IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiSend } from "react-icons/bi";

const MessageInputBox = ({ isDisabled, communityId }) => {
  const [input, setInput] = useState("");
  const toast = useToast();
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
      socket.emit(`community-${communityId}`, {
        content: input,
        sender: {
          id: session.data?.user?.id,
          username: session.data?.user?.username,
        },
        createdAt: new Date(),
      });
      mutation.mutate({ communityId, content: input });
    }
  };

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
