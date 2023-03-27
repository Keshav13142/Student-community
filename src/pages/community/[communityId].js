import { getCommunityInfo } from "@/lib/api-calls/community";
import { socket } from "@/lib/socket-client";
import CommunityTopBar from "@/src/components/community/TopBar";
import ScrollableMessageBox from "@/src/components/messages";
import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MessageInputBox from "../../components/messages/InputBox";

const Community = () => {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Get the community id from the URL of the dynamic route in NextJS
  const { communityId } = router.query;

  const {
    data: communityData,
    isLoading: isCommLoading,
    error,
  } = useQuery(
    ["communityInfo", communityId],
    () => getCommunityInfo(communityId),
    {
      enabled: Boolean(communityId),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  );

  useEffect(() => {
    console.log("SOCKET CONNECTED");
    socket.connect();
    if (communityId) {
      socket.on(`community-${communityId}`, (data) => {
        queryClient.setQueryData(["messages", communityId], (prev) => [
          ...prev,
          data,
        ]);
      });
    }
    return () => {
      socket.disconnect();
      if (communityId) socket.off(`community-${communityId}`);
      console.log("SOCKET DISCONNECTED");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  if (error) {
    const { message, redirect } = error.response.data;
    router.push(redirect);
    toast({
      title: message,
      status: "warning",
      duration: 2500,
      isClosable: true,
    });
    return null;
  }

  const isCurrentUserAdmin = communityData?.members.find(
    (m) => m.user.id === session.data?.user.id && m.type === "ADMIN"
  );

  const isCurrentUserMod = communityData?.members.find(
    (m) => m.user.id === session.data?.user.id && m.type === "MODERATOR"
  );

  const isCurrentUserMember = communityData?.members.find(
    (m) => m.user.id === session.data?.user.id
  );

  const isDisabled =
    communityData?.type === "RESTRICTED" && !isCurrentUserMember;

  return (
    <>
      <Head>
        <title>{communityData ? `${communityData.name}` : "Loading..."}</title>
        <meta name="description" content={communityData?.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex grow flex-col justify-between">
        <CommunityTopBar
          data={{
            ...communityData,
            isCurrentUserMod,
            isCurrentUserAdmin,
            isCurrentUserMember,
          }}
          isLoading={isCommLoading}
          isDisabled={isDisabled}
        />
        <ScrollableMessageBox
          communityId={communityId}
          isUserAdminOrMod={isCurrentUserMod || isCurrentUserAdmin}
        />
        <MessageInputBox isDisabled={isDisabled} communityId={communityId} />
      </div>
    </>
  );
};

Community.withAuth = true;
Community.withLayout = { showCommunityInfo: true };

export default Community;
