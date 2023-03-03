import {
  fetchMessages,
  hideOrShowMessage,
} from "@/src/utils/api-calls/messages";
import {
  Avatar,
  Box,
  Flex,
  MenuItem,
  MenuList,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextMenu } from "chakra-ui-contextmenu";
import { useSession } from "next-auth/react";
import React, { forwardRef } from "react";
import { BiShowAlt } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import { RxEyeClosed } from "react-icons/rx";
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

const MessageBubble = forwardRef(function MessageBubble({ msg }, ref) {
  return (
    <Flex
      alignSelf={msg.isOwnMessage ? "flex-end" : "flex-start"}
      maxW="45%"
      ref={ref}>
      <Stack
        w="full"
        px={3}
        py={2}
        spacing={0.4}
        cursor="pointer"
        borderRadius={10}
        bgColor={msg.isOwnMessage ? "whatsapp.50" : "purple.50"}>
        {!msg.isOwnMessage && (
          <div className="text-purple-500 font-bold text-sm">
            {msg.sender.username}
          </div>
        )}
        <div>{msg.content}</div>
        <span className={`text-sm self-end opacity-40`}>
          {Intl.DateTimeFormat("en-us", {
            timeStyle: "short",
            hour12: false,
          }).format(msg.currentMsgTime)}
        </span>
      </Stack>
    </Flex>
  );
});

const ScrollableMessageBox = ({ communityId, isUserAdminOrMod }) => {
  const session = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();

  // TODO Handle loading properly
  const { data: messages, isLoading } = useQuery(
    ["messages", communityId],
    () => fetchMessages(communityId),
    { enabled: Boolean(communityId) }
  );

  const mutation = useMutation(hideOrShowMessage, {
    onError: () => {
      toast({
        title: "Unable to perform action",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["messages", communityId], (prev) =>
        prev.map((msg) => (msg.id === newData.id ? newData : msg))
      );
    },
  });

  return (
    // Fix this scrolling stuff later
    <ScrollableFeed className="flex flex-col py-2 px-10 gap-1 custom-scrollbar">
      {messages?.map((msg, idx) => {
        msg.isOwnMessage = session.data?.user?.id === msg.sender.id;
        msg.currentMsgTime = new Date(msg.createdAt);
        msg.lastMsgTime = new Date(messages[idx - 1]?.createdAt);
        msg.msgSentToday =
          new Date().toDateString() === msg.currentMsgTime.toDateString();
        msg.isNewDateMsg =
          msg.currentMsgTime.toDateString() !== msg.lastMsgTime.toDateString();

        return (
          <React.Fragment key={idx}>
            {msg.msgSentToday && msg.isNewDateMsg && <MsgDayInfo day="Today" />}
            {msg.isNewDateMsg && !msg.msgSentToday && (
              <MsgDayInfo
                day={Intl.DateTimeFormat("en-us", {
                  dateStyle: "medium",
                }).format(msg.currentMsgTime)}
              />
            )}
            {isUserAdminOrMod && !msg.isOwnMessage ? (
              <ContextMenu
                renderMenu={() => (
                  <MenuList>
                    {msg.flag !== "HIDDEN" ? (
                      <MenuItem
                        onClick={() => {
                          mutation.mutate({ communityId, action: "hide" });
                        }}>
                        <MdHideSource size={20} className="mr-2" color="red" />
                        Hide message for everyone
                      </MenuItem>
                    ) : (
                      <>
                        <MenuItem>
                          <RxEyeClosed size={20} className="mr-2" />
                          Show content
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            mutation.mutate({ communityId, action: "reveal" });
                          }}>
                          <BiShowAlt size={20} className="mr-2" />
                          Un-hide message for everyone
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                )}>
                {(ref) => <MessageBubble msg={msg} ref={ref} />}
              </ContextMenu>
            ) : (
              <MessageBubble msg={msg} />
            )}
          </React.Fragment>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableMessageBox;
