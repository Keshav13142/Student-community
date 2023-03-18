import { fetchPublicAndRestrictedCommunities } from "@/lib/api-calls/community";
import { Avatar, Badge, Progress, useToast } from "@chakra-ui/react";
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
        <div>
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </div>
      ) : (
        <div className="m-5 flex grow flex-col items-center gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-medium text-indigo-900">
            Discover new Communities
            <BsFillPeopleFill />
          </h1>
          <div
            className={`flex grow flex-col gap-3 ${
              publicCommunities?.length > 0 ? "" : "justify-center"
            }`}
          >
            {publicCommunities?.length > 0 ? (
              publicCommunities?.map((c) => (
                <div className="flex items-center justify-between rounded-md border border-purple-500 p-3">
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
                </div>
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
          </div>
        </div>
      )}
    </>
  );
};

// Protected route
DiscoverCommunities.withAuth = true;
DiscoverCommunities.withLayout = { showCommunityInfo: true };

export default DiscoverCommunities;
