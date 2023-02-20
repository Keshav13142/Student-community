import { getCommunityInfo } from "@/src/utils/api-calls";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Input,
  Progress,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { useQuery } from "react-query";
import ScrollableFeed from "react-scrollable-feed";

const dummy_messages = [
  {
    id: 1,
    senderId: "alskdjalskdj",
    content: "Hello world",
  },
  {
    id: 2,
    senderId: "alksjdsdasdaad",
    content: "Hello worldsdasdasda",
  },
  {
    id: 3,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlda;skdjaklsjdlaksjdkljad",
  },
  {
    id: 4,
    senderId: "alksdjalskjd",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 5,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 6,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 7,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 8,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 9,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 10,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 11,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 12,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 13,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
  {
    id: 14,
    senderId: "cldttg31s0008i4y8jonub4om",
    content: "Hello worlasdasdasdad",
  },
];

const Community = () => {
  const router = useRouter();

  const session = useSession();

  // Get the community id from the URL of the dynamic route in NextJS
  const { communityId } = router.query;

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (communityId) {
      setIsEnabled(true);
    }
  }, [communityId]);

  const {
    data: community,
    error,
    isLoading,
  } = useQuery(
    ["communityInfo", communityId],
    () => getCommunityInfo(communityId),
    {
      enabled: isEnabled,
    }
  );

  return (
    <>
      <Head>
        <title>Community name</title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isLoading ? (
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
              <Avatar src={community?.image} />
              <h3 className="text-xl font-medium">{community?.name}</h3>
            </Flex>
            <IconButton icon={<ImInfo />} />
          </Flex>

          <ScrollableFeed className="flex flex-col p-2 gap-1">
            {dummy_messages.map((msg, idx) => (
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

          <Flex gap={5} p={3}>
            <Input />
            <IconButton icon={<BiSend />} />
          </Flex>
        </Stack>
      )}
    </>
  );
};

export default Community;
