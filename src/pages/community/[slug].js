import { getCommunityInfo } from "@/lib/api-calls/community";
import { fetchMessages } from "@/lib/api-calls/messages";
import CommunityTopBar from "@/src/components/community/TopBar";
import ScrollableMessageBox from "@/src/components/messages";
import MessageInputBox from "@/src/components/messages/InputBox";
import { Progress, useToast } from "@chakra-ui/react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SocketIOClient from "socket.io-client";

const Community = () => {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  // Get the community id from the URL of the dynamic route in NextJS
  const { slug } = router.query;
  const queryClient = useQueryClient();

  useEffect(() => {
    // connect to socket server
    const socket = SocketIOClient.connect(process.env.NEXT_PUBLIC_APP_URL, {
      path: "/api/socketio",
    });

    if (slug) {
      // log socket connection
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!");
      });

      // update chat on new message dispatched
      socket.on(`community-${slug}`, (data) => {
        queryClient.setQueryData(["messages", slug], (prev) => [...prev, data]);
      });
    }

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
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
        refetchOnWindowFocus: false,
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
        <div>
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </div>
      ) : (
        <div className="flex grow flex-col gap-3">
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
        </div>
      )}
    </>
  );
};

Community.withAuth = true;
Community.withLayout = { showCommunityInfo: true };

export default Community;
