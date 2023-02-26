import { fetchMessages } from "@/src/utils/api-calls";
import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableMessageBox = ({ communityId }) => {
  const session = useSession();

  // TODO Handle loading properly
  const { data, isLoading } = useQuery(
    ["messages", communityId],
    () => fetchMessages(communityId),
    { enabled: Boolean(communityId) }
  );

  return (
    // Fix this scrolling stuff later
    <ScrollableFeed className="flex flex-col py-2 px-10 gap-1">
      {data?.map((msg, idx) => (
        <Box
          maxW="45%"
          cursor="pointer"
          key={idx}
          padding={3}
          borderRadius={10}
          bgColor={
            session.data?.user?.id === msg.senderId ? "gray.300" : "plum"
          }
          alignSelf={
            session.data?.user?.id === msg.senderId ? "flex-end" : "flex-start"
          }>
          {msg.content}
        </Box>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableMessageBox;
