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
import Image from "next/image";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { BiBlock } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import Linkify from "react-linkify";

const MsgDayInfo = ({ day }) => (
  <div className="center my-2 mx-auto w-fit rounded-md bg-gray-200 px-2 py-0.5 text-sm dark:bg-zinc-600">
    {day}
  </div>
);

const MessageBubble = forwardRef(function MessageBubble({ msg }, ref) {
  return (
    <div
      ref={ref}
      className={`flex w-full flex-col gap-0.5 rounded-md px-3 py-1.5 ${
        msg.isOwnMessage
          ? "bg-green-200 dark:bg-slate-700"
          : "bg-purple-200 dark:bg-teal-800 dark:text-white"
      }`}
    >
      {msg.isDeleted ? (
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-200">
          <BiBlock />
          This message was deleted {msg.deletedBy && `by ${msg.deletedBy}`}
        </div>
      ) : (
        <>
          {!msg.isOwnMessage && (
            <div
              className={`${
                msg.sender
                  ? "dark:text-puple-400 text-purple-300"
                  : "text-slate-200"
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
          <span className="self-end text-xs opacity-70 dark:text-slate-200">
            {Intl.DateTimeFormat("en-us", {
              timeStyle: "short",
            }).format(msg.currentMsgTime)}
          </span>
        </>
      )}
    </div>
  );
});

const ScrollableMessageBox = ({ communityId, isUserAdminOrMod, messages }) => {
  const session = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const chatLastElem = useRef(null);

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

  const scrollToBottom = () => {
    chatLastElem.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
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
      <div className="flex h-72 grow flex-col gap-2 overflow-y-auto scroll-smooth py-2 px-5">
        {messages?.length > 0 ? (
          messages?.map((msg, idx) => {
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
          })
        ) : (
          <div className="flex grow flex-col items-center justify-center gap-2">
            <Image
              src="https://illustrations.popsy.co/violet/student-going-to-school.svg"
              width={300}
              height={300}
              alt="No messages"
              className="max-w-72 max-h-72"
            />
            <h2 className="font-sans text-base font-medium text-slate-500 md:text-lg xl:text-xl">
              So empty,{" "}
              <span className="text-purple-500">
                start a conversation by saying hi👋
              </span>
            </h2>
          </div>
        )}
        <div
          id="chat-end"
          className="float-left clear-both h-0 w-0"
          ref={chatLastElem}
        />
      </div>
    </>
  );
};

export default ScrollableMessageBox;
