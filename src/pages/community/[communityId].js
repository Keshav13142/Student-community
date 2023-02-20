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
} from "@chakra-ui/react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
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

  const [isEnabled, setIsEnabled] = useState(false);
  const [input, setInput] = useState("");

  const mutation = useMutation(sendMessage, {
    onError: ({
      response: {
        data: { error },
      },
    }) => {
      toast({
        title: error,
        status: "error",
        description: "Failed to send message😢",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Created community successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (communityId) {
      setIsEnabled(true);
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
  };

  return (
    <>
      <Head>
        <title>Community name</title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
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
            <IconButton icon={<ImInfo />} />
          </Flex>

          <ScrollableFeed className="flex flex-col p-2 gap-1">
            {/* {dummy_messages.map((msg, idx) => (
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
            ))} */}
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
              <IconButton icon={<BiSend />} type="submit" />
            </Flex>
          </form>
        </Stack>
      )}
    </>
  );
};

export default Community;
