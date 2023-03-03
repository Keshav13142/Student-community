import { fetchMessages } from "@/src/utils/api-calls/messages";
import { Avatar, Box, Flex, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";

const MsgDayInfo = ({ day }) => (
  <Box
    alignSelf="center"
    bg="gray.200"
    px={2}
    rounded="md"
    py={0.5}
    my={2}
    fontSize="sm">
    {day}
  </Box>
);

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
    <ScrollableFeed className="flex flex-col py-2 px-10 gap-1 custom-scrollbar">
      {data?.map((msg, idx) => {
        const isOwnMessage = session.data?.user?.id === msg.sender.id;
        const currentMsgTime = new Date(msg.createdAt);
        const lastMsgTime = new Date(data[idx - 1]?.createdAt);
        const msgSentToday =
          new Date().toDateString() === currentMsgTime.toDateString();
        const isNewDateMsg =
          currentMsgTime.toDateString() !== lastMsgTime.toDateString();

        return (
          <React.Fragment key={idx}>
            {msgSentToday && isNewDateMsg && <MsgDayInfo day="Today" />}
            {isNewDateMsg && !msgSentToday && (
              <MsgDayInfo
                day={Intl.DateTimeFormat("en-us", {
                  dateStyle: "medium",
                }).format(currentMsgTime)}
              />
            )}

            <Flex
              alignSelf={isOwnMessage ? "flex-end" : "flex-start"}
              maxW="45%">
              <Stack
                w="full"
                px={3}
                py={2}
                spacing={0.4}
                cursor="pointer"
                borderRadius={10}
                bgColor={isOwnMessage ? "whatsapp.100" : "purple.100"}>
                {!isOwnMessage && (
                  <div className="text-purple-500 font-bold text-sm">
                    {msg.sender.username}
                  </div>
                )}
                <div>{msg.content}</div>
                <span className={`text-sm self-end opacity-40`}>
                  {Intl.DateTimeFormat("en-us", {
                    timeStyle: "short",
                    hour12: false,
                  }).format(currentMsgTime)}
                </span>
              </Stack>
            </Flex>
          </React.Fragment>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableMessageBox;
