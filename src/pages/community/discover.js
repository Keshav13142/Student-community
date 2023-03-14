import { fetchPublicAndRestrictedCommunities } from "@/src/utils/api-calls/community";
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
import { BsFillPeopleFill } from "react-icons/bs";
import { SlInfo } from "react-icons/sl";

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
          <h1 className="flex items-center gap-2 text-2xl font-medium text-indigo-900">
            Discover new Communities
            <BsFillPeopleFill />
          </h1>
          <Stack
            spacing={3}
            justifyContent={publicCommunities?.length > 0 ? "" : "center"}
            flexGrow={1}
          >
            {publicCommunities?.length > 0 ? (
              publicCommunities?.map((c) => (
                <Flex
                  className="rounded-md border border-purple-500"
                  key={c.id}
                  alignItems="center"
                  justifyContent="space-between"
                  p={3}
                  minW="md"
                >
                  <div className="flex items-center gap-5">
                    <Avatar src={c.image} name={c.name} />
                    <div className="flex flex-col">
                      <Link
                        href={`/community/${c.slug}`}
                        className="text-lg font-medium text-blue-700 hover:underline"
                      >
                        # {c.name}
                      </Link>
                      <span>{c.desc}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    color={c.type === "PUBLIC" ? "whatsapp.400" : "blue.300"}
                  >
                    {c.type}
                  </Badge>
                </Flex>
              ))
            ) : (
              <div className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-[50%] animate-pulse"
                  src="https://doodleipsum.com/700x394/outline?i=c03e7275e5d70c0305b16230cb66f01c"
                  alt="empty"
                />
                <div className="flex items-center gap-2 rounded-xl border border-purple-400 px-4 py-2 text-xl">
                  <SlInfo />
                  <span>No public communities found</span>
                </div>
              </div>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};

// Protected route
DiscoverCommunities.withAuth = true;

export default DiscoverCommunities;
