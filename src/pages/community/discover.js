import { fetchPublicAndRestrictedCommunities } from "@/lib/api-calls/community";
import { Avatar, Badge, Progress, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
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
        <div className="m-5 flex grow flex-col items-center gap-5">
          <h1 className="flex items-center gap-5 text-xl font-medium text-indigo-900 md:text-2xl">
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
                  <div className="flex items-center gap-3">
                    <Avatar src={c.image} name={c.name} size={["sm", "md"]} />
                    <div className="flex flex-col">
                      <Link
                        href={`/community/${c.slug}`}
                        className="text-base font-medium text-blue-700 hover:underline md:text-lg"
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
              <div className="flex flex-col items-center gap-3">
                <Image
                  src="https://doodleipsum.com/700x394/outline?i=c03e7275e5d70c0305b16230cb66f01c"
                  width={300}
                  height={300}
                  alt="No public communities"
                  className="max-w-72 max-h-72"
                />
                <div className="flex items-center gap-2 rounded-md border border-purple-400 px-4 py-2 font-medium text-slate-500 md:text-lg">
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
