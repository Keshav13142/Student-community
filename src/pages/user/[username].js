/* eslint-disable @next/next/no-img-element */
import prisma from "@/lib/prisma";
import EditProfile from "@/src/components/modals/edit-profile";
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { GoMarkGithub } from "react-icons/go";
import { GrLinkedin } from "react-icons/gr";
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

  const { username } = query;
  const { user } = session;

  const profile = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      image: true,
      linkedinLink: true,
      githubLink: true,
      email: true,
      bio: true,
      institutionMember: {
        select: {
          institutionId: true,
        },
      },
      posts: {
        // If the user is viewing their own page then show unpublished posts
        ...(user.username !== username ? { where: { published: true } } : {}),
        select: {
          id: true,
          published: true,
          content: true,
          slug: true,
          bannerImage: true,
          createdAt: true,
          title: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!profile) {
    return {
      redirect: {
        destination: "/discover",
        permanent: false,
      },
    };
  }

  const communities = await prisma.community.findMany({
    where: {
      institutionId: profile.institutionMember.institutionId,
      ...(user.username !== username
        ? {
            type: {
              not: "PRIVATE",
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      image: true,
      desc: true,
    },
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  return {
    props: {
      profile: profile
        ? {
            ...profile,
            posts: profile.posts.map((p) => ({
              ...p,
              content: p.content.slice(0, 100),
              createdAt: p.createdAt.toISOString(),
            })),
          }
        : profile,
      communities,
      ownProfile: profile?.username === user.username,
    },
  };
}

const UserProfile = ({ profile, communities, ownProfile }) => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Head>
        <title>{profile ? `@${profile.username}` : "User not found"}</title>
        <meta
          name="description"
          content={
            profile
              ? profile.bio
              : "Platform for students within institutions to interact"
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex items-center justify-center px-2 py-5 pt-10 lg:px-10">
        <EditProfile isOpen={isOpen} onClose={onClose} />
        {!profile ? (
          <div className="flex flex-col items-center justify-center px-10 pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="aspect-video h-48 w-52"
              src="https://cdn-icons-png.flaticon.com/512/5545/5545083.png"
              alt="not found"
            />
            <Alert
              status="warning"
              variant="left-accent"
              maxW="sm"
              colorScheme="purple"
            >
              <AlertIcon />
              User not found
            </Alert>
          </div>
        ) : (
          <div className="flex w-full max-w-[90dvw] flex-col gap-10 md:max-w-[75dvw] lg:max-w-[60dvw] xl:max-w-[45vw]">
            <div className="rounded-md border-2 border-slate-200 px-3 py-2 dark:border-slate-700 dark:text-slate-300">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={profile.image}
                    name={profile.name}
                    size={["sm", "md"]}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-medium">{profile.name}</h3>
                      {ownProfile && (
                        <BiEdit className="cursor-pointer" onClick={onOpen} />
                      )}
                    </div>
                    <h4 className="text-purple-500 dark:text-purple-400">
                      @{profile.username}
                    </h4>
                  </div>
                </div>
                <p>{profile.bio}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <GoMarkGithub size={20} />
                    {profile.githubLink ? (
                      <a
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        href={profile.githubLink}
                        rel="noreferrer"
                      >
                        {profile.githubLink}
                      </a>
                    ) : (
                      "Not updated"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <GrLinkedin size={20} />
                    {profile.linkedinLink ? (
                      <a
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        href={profile.linkedinLink}
                        rel="noreferrer"
                      >
                        {profile.linkedinLink}
                      </a>
                    ) : (
                      "Not updated"
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex grow flex-col">
              <Tabs colorScheme="purple" isFitted variant="line">
                <TabList>
                  <Tab>Posts</Tab>
                  <Tab>Communities</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel className="flex max-h-[60dvh] flex-col gap-5 overflow-y-auto">
                    {profile.posts.length > 0 ? (
                      profile.posts.map((p, idx) => (
                        <div
                          className="flex items-center justify-between gap-2 rounded-lg border-2 border-slate-200 px-4 py-2 dark:border-slate-700"
                          key={idx}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 md:gap-2 lg:gap-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={
                                    p.published
                                      ? `/blog/${p.slug}`
                                      : `/blog/${p.id}/edit`
                                  }
                                  className="hover:underline"
                                >
                                  <h2 className="text-sm font-medium text-slate-900 dark:text-slate-300 lg:text-lg">
                                    {p.title}
                                  </h2>
                                </Link>
                                {!p.published ? (
                                  <Badge colorScheme="purple">Draft</Badge>
                                ) : (
                                  ownProfile && (
                                    <IconButton
                                      icon={<FiEdit />}
                                      size="xs"
                                      onClick={() =>
                                        router.push(`/blog/${p.id}/edit`)
                                      }
                                      bg="transparent"
                                    />
                                  )
                                )}
                              </div>
                              <span className="block text-sm text-slate-500 line-clamp-2 dark:text-slate-400 lg:text-base">
                                {p.content}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-medium text-gray-500 lg:text-sm">
                              {format(new Date(p.createdAt), "MMM d")}
                            </span>
                          </div>
                          <Link
                            className="hidden sm:block"
                            href={
                              p.published
                                ? `/blog/${p.slug}`
                                : `/blog/${p.id}/edit`
                            }
                          >
                            {p.bannerImage === "" || !p.bannerImage ? (
                              <Image
                                src="https://cdn-icons-png.flaticon.com/512/3875/3875148.png"
                                height="96"
                                width="128"
                                className="max-h-[6em] max-w-[6em] object-cover"
                                alt="No img"
                              />
                            ) : (
                              <img
                                src={p.bannerImage}
                                className="aspect-video h-24 w-32 flex-1 rounded-md object-cover"
                                alt={p.title}
                              />
                            )}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="mt-3 flex flex-col items-center gap-2">
                        <h2 className="text-center text-lg font-medium text-slate-600 lg:text-lg">
                          {ownProfile ? "You have" : "This user has"} not
                          authored any posts
                        </h2>
                        <Image
                          src="https://illustrations.popsy.co/violet/falling.svg"
                          className="object-cover"
                          height={200}
                          width={200}
                          alt="No img"
                        />
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel className="flex max-h-[60dvh] flex-col gap-3 overflow-y-auto">
                    {communities.map((c, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-300 dark:border-slate-500"
                      >
                        <Link href={`/community/${c.id}`}>
                          <div className="flex items-center gap-2 rounded-xl p-2">
                            <Avatar
                              src={c.image}
                              name={c.name}
                              size={["sm", "md"]}
                            />
                            <div className="flex flex-col gap-2">
                              <h4 className="text-sm font-medium dark:text-slate-300 lg:text-lg">
                                {c.name}
                              </h4>
                              <span className="text-sm dark:text-slate-400 lg:text-base">
                                {c.desc}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

UserProfile.withLayout = { showCommunityInfo: false };

export default UserProfile;
