import { fetchPublicAndRestrictedCommunities } from "@/src/utils/api-calls";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Progress,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";

const DiscoverCommunities = () => {
  const {
    data: publicCommunities,
    error,
    isloading,
  } = useQuery(["publicCommunities"], fetchPublicAndRestrictedCommunities);

  const toast = useToast();

  if (error) {
    toast({
      title: "Unable to fetch communities!!",
      description: "Please try refreshing the page!!",
      status: "error",
      duration: 4000,
      isClosable: true,
    });

    return null;
  }

  return (
    <>
      <Head>
        <title>Discover | Communitites</title>
        <meta
          name="description"
          content="Discover various communities within your institution.."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isloading ? (
        <Box w="full">
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </Box>
      ) : (
        <Stack align="center" w="100%" spacing={5} m={5}>
          <h1 className="text-2xl font-medium flex gap-2 items-center text-indigo-900">
            Discover new Communities
            <BsFillPeopleFill />
          </h1>
          <Stack spacing={3}>
            {publicCommunities?.map((c) => (
              <Flex
                className="border border-purple-500 rounded-md"
                key={c.id}
                alignItems="center"
                justifyContent="space-between"
                p={3}
                minW="lg">
                <Flex gap={5} alignItems="center">
                  <Avatar src={c.image} name={c.name} />
                  <Stack>
                    <Link
                      href={`/community/${c.id}`}
                      className="text-lg font-medium hover:underline hover:text-blue-700">
                      # {c.name}
                    </Link>
                    <span>{c.desc}</span>
                  </Stack>
                </Flex>
                <Badge
                  variant="outline"
                  color={c.type === "PUBLIC" ? "whatsapp.400" : "blue.300"}>
                  {c.type}
                </Badge>
              </Flex>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

// Protected route
DiscoverCommunities.auth = true;

export default DiscoverCommunities;
