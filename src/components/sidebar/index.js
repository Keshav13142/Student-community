import {
  Button,
  Divider,
  Heading,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const fetchCommunities = async () => {
  const response = await fetch("/api/community/me");

  if (response.ok) {
    return await response.json();
  }
  return null;
};

const SideBar = () => {
  const [communities, setCommunities] = useState([]);

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await fetchCommunities();

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
      display={{ base: "none", lg: "flex" }}
      alignItems="center"
      p={3}>
      <Text className="text-xl font-medium">Your communities</Text>
      <Divider />
      <Skeleton isLoaded={!loading} display="flex" flexDirection="column">
        {communities === [] ? (
          <h2>Communities you join will show up here!</h2>
        ) : (
          communities?.map((c) => (
            <Button
              alignSelf="center"
              w="100%"
              variant="ghost"
              textColor="purple.600"
              key={c.id}>
              {`# ${c.name}`}
            </Button>
          ))
        )}
      </Skeleton>
    </Stack>
  );
};

export default SideBar;
