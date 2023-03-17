import { getCommunityInfo } from "@/lib/api-calls/community";
import { fetchMessages } from "@/lib/api-calls/messages";
import CommunityTopBar from "@/src/components/community/TopBar";
import ScrollableMessageBox from "@/src/components/messages";
import MessageInputBox from "@/src/components/messages/InputBox";
import { Box, Progress, Stack, useToast } from "@chakra-ui/react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect } from "react";

const Community = ({ community }) => {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  // Get the community id from the URL of the dynamic route in NextJS
  const { slug } = router.query;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (slug) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });
      const channel = pusher.subscribe(`community-${slug}`);
      channel.bind("chat", function (data) {
        if (data.sender.id === session.data?.user.id) return;
        queryClient.setQueryData(["messages", slug], (prev) => [...prev, data]);
      });
      return () => {
        pusher.unsubscribe(`community-${slug}`);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const [
    { data: communityData, isLoading: isCommLoading, error },
    { data: messages, isLoading: isMessagesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["communityInfo", slug],
        queryFn: () => getCommunityInfo(slug),
        enabled: Boolean(slug),
      },
      {
        queryKey: ["messages", slug],
        queryFn: () => fetchMessages(slug),
        enabled: Boolean(slug),
      },
    ],
  });

  if (error) {
    const { message, redirect } = error.response.data;
    toast({
      title: message,
      status: "warning",
      duration: 2500,
      isClosable: true,
    });
    router.push(redirect);
    return null;
  }

  const isCurrentUserAdmin = communityData?.members.find(
    (m) => m.user.id === session.data?.user.id && m.type === "ADMIN"
  );

  const isCurrentUserMod = communityData?.members.find(
    (m) => m.user.id === session.data?.user.id && m.type === "MODERATOR"
  );

  const isDisabled =
    communityData?.type === "RESTRICTED" &&
    !communityData?.members.find((m) => m.user.id === session.data?.user.id);

  return (
    <>
      <Head>
        <title>{communityData ? `${communityData.name}` : "Loading..."}</title>
        <meta name="description" content={communityData?.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isCommLoading || isMessagesLoading ? (
        <Box w="full">
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </Box>
      ) : (
        <Stack w="full" spacing={3} maxH="93.3vh">
          <CommunityTopBar
            data={{
              ...communityData,
              isCurrentUserMod,
              isCurrentUserAdmin,
            }}
            isDisabled={isDisabled}
          />
          <ScrollableMessageBox
            slug={slug}
            messages={messages}
            isUserAdminOrMod={isCurrentUserMod || isCurrentUserAdmin}
          />
          <MessageInputBox isDisabled={isDisabled} slug={slug} />
        </Stack>
      )}
    </>
  );
};

export default Community;
