import { fetchPublicAndRestrictedCommunities } from "@/src/utils/api-calls";
import { Flex, useToast } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

const DiscoverCommunities = () => {
  const {
    data: publicCommunities,
    error,
    loading,
  } = useQuery("publicCommunities", fetchPublicAndRestrictedCommunities);

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
      <Flex direction="column" gap={10} p={5} alignItems="center" w="100%">
        {publicCommunities?.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </Flex>
    </>
  );
};

// Protected route
DiscoverCommunities.auth = true;

export default DiscoverCommunities;
