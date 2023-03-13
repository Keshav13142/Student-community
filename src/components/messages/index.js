import { hideOrShowMessage } from "@/src/utils/api-calls/messages";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContextMenu } from "chakra-ui-contextmenu";
import { useSession } from "next-auth/react";
import React, { forwardRef, useRef, useState } from "react";
import { BiBlock } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import Linkify from "react-linkify";
import ScrollableFeed from "react-scrollable-feed";

const MsgDayInfo = ({ day }) => (
  <Box
    alignSelf="center"
    bg="gray.200"
    px={2}
    rounded="md"
    py={0.5}
    my={2}
    fontSize="sm"
  >
    {day}
  </Box>
);

const MessageBubble = forwardRef(function MessageBubble({ msg }, ref) {
  return (
    <Flex
      alignSelf={msg.isOwnMessage ? "flex-end" : "flex-start"}
      maxW="45%"
      ref={ref}
    >
      <Stack
        w="full"
        px={3}
        py={2}
        spacing={0.4}
        borderRadius={10}
        bgColor={msg.isOwnMessage ? "whatsapp.50" : "purple.50"}
      >
        {msg.isDeleted ? (
          <Flex alignItems="center" gap={2} className="text-slate-500">
            <BiBlock />
            This message was deleted {msg.deletedBy && `by ${msg.deletedBy}`}
          </Flex>
        ) : (
          <>
            {!msg.isOwnMessage && (
              <div
                className={`${
                  msg.sender ? "text-purple-500" : "text-slate-400"
                } text-sm font-bold`}
              >
                {msg.sender ? msg.sender.username : "[deleted]"}
              </div>
            )}
            <Linkify
              properties={{
                target: "_blank",
                style: { color: "red", fontWeight: "bold" },
              }}
            >
              {msg.content}
            </Linkify>
            <span className={`self-end text-sm opacity-40`}>
              {Intl.DateTimeFormat("en-us", {
                timeStyle: "short",
                hour12: false,
              }).format(msg.currentMsgTime)}
            </span>
          </>
        )}
      </Stack>
    </Flex>
  );
});

const ScrollableMessageBox = ({ communityId, isUserAdminOrMod, messages }) => {
  const session = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [deleteMessageId, setDeleteMessageId] = useState(null);

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
    onSettled: () => {
      setDeleteMessageId(null);
    },
  });

  return (
    // Fix this scrolling stuff later
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Message
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cannot revert this action
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  mutation.mutate({
                    communityId,
                    messageId: deleteMessageId,
                    deletedBy: session?.data?.user?.name,
                  });
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <ScrollableFeed className="custom-scrollbar flex flex-col gap-1 py-2 px-10">
        {messages?.map((msg, idx) => {
          msg.isOwnMessage = session.data?.user?.id === msg.sender?.id;
          msg.currentMsgTime = new Date(msg.createdAt);
          msg.lastMsgTime = new Date(messages[idx - 1]?.createdAt);
          msg.msgSentToday =
            new Date().toDateString() === msg.currentMsgTime.toDateString();
          msg.isNewDateMsg =
            msg.currentMsgTime.toDateString() !==
            msg.lastMsgTime.toDateString();

          return (
            <React.Fragment key={idx}>
              {msg.msgSentToday && msg.isNewDateMsg && (
                <MsgDayInfo day="Today" />
              )}
              {msg.isNewDateMsg && !msg.msgSentToday && (
                <MsgDayInfo
                  day={Intl.DateTimeFormat("en-us", {
                    dateStyle: "medium",
                  }).format(msg.currentMsgTime)}
                />
              )}
              {isUserAdminOrMod && !msg.isOwnMessage && !msg.isDeleted ? (
                <ContextMenu
                  renderMenu={() => (
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setDeleteMessageId(msg.id);
                          onOpen();
                        }}
                      >
                        <MdHideSource size={20} className="mr-2" color="red" />
                        Delete message for everyone
                      </MenuItem>
                    </MenuList>
                  )}
                >
                  {(ref) => <MessageBubble msg={msg} ref={ref} />}
                </ContextMenu>
              ) : (
                <MessageBubble msg={msg} />
              )}
            </React.Fragment>
          );
        })}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableMessageBox;
