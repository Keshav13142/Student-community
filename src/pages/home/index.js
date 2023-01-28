import { Flex, useToast } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const fetchPublicCommunities = async () => {
  const response = await fetch("/api/community");
  if (response.ok) {
    return await response.json();
  }
  return null;
};

const DiscoverCommunities = () => {
  const [publicCommunities, setPublicCommunitites] = useState([]);

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await fetchPublicCommunities();

      if (!data) {
        toast({
          title: "Unable to fetch communities!!",
          description: "Please try refreshing the page!!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });

        return;
      }

      setPublicCommunitites(data);

      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Discover | Communitites</title>
        <meta
          name="description"
          content="Discover various communities within your institution.."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" gap={10} p={5} alignItems="center" w="100%">
        {publicCommunities?.map((c) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </Flex>
    </>
  );
};

DiscoverCommunities.auth = true;

export default DiscoverCommunities;
