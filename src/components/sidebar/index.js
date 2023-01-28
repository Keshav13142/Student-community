import {
  Avatar,
  Button,
  Divider,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

// Fetch all the communities that the user is a part of
const fetchCommunities = async () => {
  const response = await fetch("/api/community/me");

  if (response.ok) {
    return await response.json();
  }
  return null;
};

const SideBar = () => {
  const router = useRouter();

  const [communities, setCommunities] = useState([]);

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // Fetch data on mount
  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await fetchCommunities();

      console.log("Data from sidebar", data);

      if (!data) {
        toast({
          title: "Unable to fetch your communities!!",
          description: "Please try refreshing the page!!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });

        return;
      }

      setCommunities(data);

      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      className="shadow-md shadow-purple-600"
      maxW="md"
      minW="xs"
      display={{ base: "none", lg: "flex" }}
      alignItems="center"
      p={3}>
      <Text className="text-xl font-medium">Your communities</Text>
      <Divider />
      <Skeleton
        isLoaded={!loading}
        display="flex"
        flexDirection="column"
        fadeDuration={1}>
        {communities === [] ? (
          <h2>Communities you join will show up here!</h2>
        ) : (
          communities?.map((c) => (
            <Button
              className="py-7"
              leftIcon={<Avatar src={c.image} name={c.name} />}
              alignSelf="center"
              w="100%"
              variant="solid"
              textColor="purple.600"
              onClick={() => {
                router.push(`/community/${c.id}`);
              }}
              key={c.id}>
              {c.name}
            </Button>
          ))
        )}
      </Skeleton>
    </Stack>
  );
};

export default SideBar;
