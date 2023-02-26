import AboutCommunity from "@/src/components/modals/AboutCommunity";
import {
  fetchMessages,
  getCommunityInfo,
  sendMessage,
} from "@/src/utils/api-calls";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Input,
  Progress,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import ScrollableFeed from "react-scrollable-feed";

const Community = () => {
  const router = useRouter();
  const session = useSession();
  // Get the community id from the URL of the dynamic route in NextJS
  const { communityId } = router.query;
  const queryClient = useQueryClient();

  const [isEnabled, setIsEnabled] = useState(false);
  const [input, setInput] = useState("");

  const {
    isOpen: isAboutOpen,
    onClose: onAboutClose,
    onOpen: onAboutOpen,
  } = useDisclosure();

  const mutation = useMutation(sendMessage, {
    onError: () => {
      toast({
        title: "Failed to send message😢",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      setInput("");
    },
  });

  useEffect(() => {
    if (communityId) {
      setIsEnabled(true);
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`community-${communityId}`);

      channel.bind("chat", function (data) {
        queryClient.setQueryData(["messages", communityId], (prev) => [
          ...prev,
          data,
        ]);
      });

      return () => {
        pusher.unsubscribe(`community-${communityId}`);
      };
    }
  }, [communityId]);

  const [communityQuery, messagesQuery] = useQueries({
    queries: [
      {
        queryKey: ["communityInfo", communityId],
        queryFn: () => getCommunityInfo(communityId),
        enabled: isEnabled,
      },
      {
        queryKey: ["messages", communityId],
        queryFn: () => fetchMessages(communityId),
        enabled: isEnabled,
      },
    ],
  });

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      mutation.mutate({ communityId, content: input });
    }
  };

  return (
    <>
      <Head>
        <title>
          {communityQuery.data
            ? `Community | ${communityQuery.data.name}`
            : "Loading..."}
        </title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <AboutCommunity
        data={communityQuery.data}
        isOpen={isAboutOpen}
        onClose={onAboutClose}
      />
      {communityQuery.isLoading ? (
        <Box w="full">
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </Box>
      ) : (
        //Fix this scrolling stuff later
        <Stack w="full" spacing={3} maxH="93.3vh">
          <Flex
            px={2}
            py={2}
            alignItems="center"
            justifyContent="space-between"
            className="shadow-sm">
            <Flex gap={4} align="center">
              <IconButton
                icon={<FaChevronLeft />}
                onClick={() => {
                  router.push("/home");
                }}
              />
              <Avatar src={communityQuery.data?.image} />
              <h3 className="text-xl font-medium">
                {communityQuery.data?.name}
              </h3>
            </Flex>
            <IconButton icon={<ImInfo />} onClick={onAboutOpen} />
          </Flex>

          <ScrollableFeed className="flex flex-col p-2 gap-1">
            {messagesQuery.data?.map((msg, idx) => (
              <Box
                maxW="45%"
                key={idx}
                padding={3}
                borderRadius={10}
                bgColor={
                  session.data?.user?.id === msg.senderId ? "gray.300" : "plum"
                }
                alignSelf={
                  session.data?.user?.id === msg.senderId
                    ? "flex-end"
                    : "flex-start"
                }>
                {msg.content}
              </Box>
            ))}
          </ScrollableFeed>

          <form onSubmit={handleMessageSend}>
            <Flex gap={5} p={3}>
              <Input
                value={input}
                placeholder="Send a message"
                borderWidth={2}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <IconButton
                icon={<BiSend />}
                type="submit"
                disabled={mutation.isLoading}
              />
            </Flex>
          </form>
        </Stack>
      )}
    </>
  );
};

export default Community;
