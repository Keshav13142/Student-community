import { hideOrShowMessage } from "@/lib/api-calls/messages";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContextMenu } from "chakra-ui-contextmenu";
import { useSession } from "next-auth/react";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { BiBlock } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import Linkify from "react-linkify";

const MsgDayInfo = ({ day }) => (
  <div className="center my-2 mx-auto w-fit rounded-md bg-gray-200 px-2 py-0.5 text-sm">
    {day}
  </div>
);

const MessageBubble = forwardRef(function MessageBubble({ msg }, ref) {
  return (
    <div
      className={`flex w-full flex-col gap-0.5 rounded-md px-3 py-1.5 ${
        msg.isOwnMessage ? "bg-green-200" : "bg-purple-200"
      }`}
    >
      {msg.isDeleted ? (
        <div className="flex items-center gap-2 text-slate-500">
          <BiBlock />
          This message was deleted {msg.deletedBy && `by ${msg.deletedBy}`}
        </div>
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
          <span className={`self-end text-xs opacity-40`}>
            {Intl.DateTimeFormat("en-us", {
              timeStyle: "short",
            }).format(msg.currentMsgTime)}
          </span>
        </>
      )}
    </div>
  );
});

const ScrollableMessageBox = ({ slug, isUserAdminOrMod, messages }) => {
  const session = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const latestMessageRef = useRef(undefined);

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
      queryClient.setQueryData(["messages", slug], (prev) =>
        prev.map((msg) => (msg.id === newData.id ? newData : msg))
      );
    },
    onSettled: () => {
      setDeleteMessageId(null);
    },
  });

  useEffect(() => {
    if (messages) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

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
                    slug,
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
      <div className="flex h-72 grow flex-col gap-2 overflow-y-auto scroll-smooth py-2 px-5">
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
              <div
                className={`${
                  msg.isOwnMessage ? "self-end" : "self-start"
                } w-fit`}
                ref={idx + 1 === messages?.length ? latestMessageRef : null}
              >
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
                          <MdHideSource
                            size={20}
                            className="mr-2"
                            color="red"
                          />
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
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default ScrollableMessageBox;
