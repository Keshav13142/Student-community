import { sendMessage } from "@/lib/api-calls/messages";
import { Flex, IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

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
    const { user } = session.data;
    if (mutation.isLoading) return;
    if (input.trim() !== "") {
      setInput("");
      mutation.mutate({ slug, content: input });
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
