import CommunityTopBar from "@/src/components/community/TopBar";
import ScrollableMessageBox from "@/src/components/messages";
import MessageInputBox from "@/src/components/messages/InputBox";
import { getCommunityInfo } from "@/src/utils/api-calls/community";
import { Box, Progress, Stack } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect } from "react";

const Community = () => {
  const router = useRouter();
  const session = useSession();
  // Get the community id from the URL of the dynamic route in NextJS
  const { slug } = router.query;
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   if (slug) {
  //     const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  //       cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  //     });

  //     const channel = pusher.subscribe(`community-${slug}`);

  //     channel.bind("chat", function (data) {
  //       queryClient.setQueryData(["messages", slug], (prev) => [
  //         ...prev,
  //         data,
  //       ]);
  //     });

  //     return () => {
  //       pusher.unsubscribe(`community-${slug}`);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [slug]);

  const { data, isLoading } = useQuery(
    ["communityInfo", slug],
    () => getCommunityInfo(slug),
    {
      enabled: Boolean(slug),
    }
  );

  const isCurrentUserAdmin =
    data?.members.find((m) => m.id === session?.data?.user?.id)?.communityAdmin
      .length > 0;

  const isCurrentUserMod =
    data?.members.find((m) => m.id === session?.data?.user?.id)
      ?.communityModerator.length > 0;

  const isDisabled =
    data?.type === "RESTRICTED" &&
    !data?.members.find((m) => m.id === session?.data?.user.id);

  return (
    <>
      <Head>
        <title>{data ? `Community | ${data.name}` : "Loading..."}</title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {isLoading ? (
        <Box w="full">
          <Progress size="md" isIndeterminate colorScheme="purple" />
        </Box>
      ) : (
        <Stack w="full" spacing={3} maxH="93.3vh">
          <CommunityTopBar
            data={{
              ...data,
              isCurrentUserMod,
              isCurrentUserAdmin,
            }}
            isDisabled={isDisabled}
          />

          <ScrollableMessageBox
            slug={slug}
            isUserAdminOrMod={isCurrentUserMod || isCurrentUserAdmin}
          />

          <MessageInputBox isDisabled={isDisabled} slug={slug} />
        </Stack>
      )}
    </>
  );
};

export default Community;
