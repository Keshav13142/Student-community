import prisma from "@/lib/prisma";
import CommunityTopBar from "@/src/components/community/TopBar";
import ScrollableMessageBox from "@/src/components/messages";
import MessageInputBox from "@/src/components/messages/InputBox";
import { getCommunityInfo } from "@/src/utils/api-calls/community";
import { Box, Progress, Stack } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user } = session;
  const { slug } = query;

  if (!slug) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  const community = await prisma.community.findUnique({
    where: { slug },
    select: {
      id: true,
      image: true,
      desc: true,
      type: true,
      name: true,
      messages: true,
      members: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          communityAdmin: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
          communityModerator: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
        },
      },
      admins: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          communityAdmin: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
          communityModerator: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
        },
      },
      moderators: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          communityAdmin: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
          communityModerator: {
            select: {
              id: true,
            },
            where: {
              slug,
            },
          },
        },
      },
    },
  });

  community.isCurrentUserAdmin =
    community.admins.find((m) => m.id === user.id)?.communityAdmin.length > 0;

  community.isCurrentUserMod =
    community.moderators.find((m) => m.id === user.id)?.communityModerator
      .length > 0;

  community.isDisabled =
    community.type === "RESTRICTED" &&
    ![...community.members, ...community.admins, ...community.moderators].find(
      (m) => m.id === user.id
    );

  return {
    props: {
      community: {
        ...community,
        messages: community.messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        })),
      },
      user,
    },
  };
}

const Community = ({ community, user }) => {
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

  return (
    <>
      <Head>
        <title>
          {community ? `Community | ${community.name}` : "Loading..."}
        </title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Stack w="full" spacing={3} maxH="93.3vh">
        <CommunityTopBar data={community} isDisabled={community.isDisabled} />

        <ScrollableMessageBox
          messages={community.messages}
          communityId={community.id}
          isUserAdminOrMod={
            community.isCurrentUserMod || community.isCurrentUserAdmin
          }
        />

        <MessageInputBox
          isDisabled={community.isDisabled}
          communityId={community.id}
        />
      </Stack>
    </>
  );
};

export default Community;
