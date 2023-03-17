import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Divider,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
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

  if (!query.username.startsWith("@")) {
    return {
      redirect: {
        destination: "/community/discover",
        permanent: false,
      },
    };
  }

  const username = query.username.split("@")[1];
  const { user } = session;

  const profile = await prisma.user.findUnique({
    where: { username: username },
    select: {
      name: true,
      username: true,
      image: true,
      linkedinLink: true,
      githubLink: true,
      email: true,
      bio: true,
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

  const communities = await prisma.community.findMany({
    where: {
      ...(user.username !== username
        ? {
            type: {
              not: "PRIVATE",
            },
          }
        : {}),
    },
    select: {
      slug: true,
      name: true,
      image: true,
      desc: true,
    },
  });

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
  return (
    <>
      <Head>
        <title>{profile ? `@${profile.username}` : "User not found"}</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
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
          <div className="flex flex-col items-center gap-10 rounded-xl p-5 pt-10 lg:flex-row lg:items-start lg:justify-center lg:px-10">
            <div className="order-2 flex min-w-[50%] max-w-4xl flex-col gap-5 lg:order-1">
              <h1 className="text-2xl font-medium">{profile.name}</h1>
              <Tabs variant="line">
                <TabList>
                  <Tab>Posts</Tab>
                  <Tab>Communities</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel className="flex h-[60vh] flex-col gap-5 overflow-y-auto">
                    {profile.posts.length > 0 ? (
                      profile.posts.map((p, idx) => (
                        <div
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-300 px-4 py-2"
                          key={idx}
                        >
                          <div className="grow">
                            <div className="mb-2 flex flex-col gap-1 md:gap-2 lg:gap-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={
                                    p.published
                                      ? `/blog/${p.slug}`
                                      : `/blog/${p.id}/edit`
                                  }
                                  className="hover:underline"
                                >
                                  <h2 className="text-base font-medium text-slate-900 lg:text-lg">
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
                                      color="blue"
                                    />
                                  )
                                )}
                              </div>
                              <h3 className="max-w-sm text-sm text-gray-500 line-clamp-2 lg:text-base">
                                {p.content}
                              </h3>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-gray-500 lg:text-sm">
                                {format(new Date(p.createdAt), "MMM d")}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={
                              p.published
                                ? `/blog/${p.slug}`
                                : `/blog/${p.id}/edit`
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.bannerImage}
                              className="aspect-video h-24 w-32 rounded-md object-cover"
                              alt={p.title}
                            />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl">
                          {ownProfile ? "You have" : "This user has"} not
                          authored any posts
                        </h2>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="max-w-sm"
                          src="https://i.kym-cdn.com/entries/icons/original/000/006/707/nothing-to-do-here-template.jpg.scaled500.jpg"
                          alt="oh so empty"
                        />
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel className="flex flex-col gap-3">
                    {communities.map((c, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-purple-400"
                      >
                        <Link href={`/community/${c.slug}`}>
                          <div className="flex items-center gap-2 rounded-xl p-2">
                            <Avatar src={c.image} name={c.name} />
                            <div className="flex flex-col gap-2">
                              <h4 className="text-base font-medium lg:text-lg">
                                {c.name}
                              </h4>
                              <span className="text-sm lg:text-base">
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
            <div className="order-1 h-fit max-w-xl rounded-md border-2 border-purple-300 px-3 py-2 lg:order-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar src={profile.image} name={profile.name} size="xl" />
                  <div>
                    <h3 className="text-xl font-medium">{profile.name}</h3>
                    <h4 className="text-purple-500">@{profile.username}</h4>
                  </div>
                </div>
                <p>{profile.bio}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <GoMarkGithub size={20} />
                    <a
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      href={profile.githubLink}
                    >
                      {profile.githubLink}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <GrLinkedin size={20} />
                    {profile.linkedinLink ? (
                      <a
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        href={profile.linkedinLink}
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
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
