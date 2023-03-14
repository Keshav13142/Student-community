import { sendMessage } from "@/src/utils/api-calls/messages";
import { Flex, IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";

const MessageInputBox = ({ isDisabled, slug }) => {
  const [input, setInput] = useState("");
  const toast = useToast();

  const mutation = useMutation(sendMessage, {
    onError: () => {
      toast({
        title: "Failed to send message😢",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      setInput("");
    },
  });

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
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
        <Flex gap={5} p={3}>
          <Input
            disabled={isDisabled}
            value={input}
            placeholder="Send a message"
            borderWidth={2}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <IconButton
            isDisabled={isDisabled}
            icon={<BiSend />}
            type="submit"
            disabled={mutation.isLoading}
          />
        </Flex>
      </Tooltip>
    </form>
  );
};

export default MessageInputBox;
