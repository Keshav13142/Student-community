import prisma from "@/lib/prisma";
import Navbar from "@/src/components/Layout/navbar";
import {
  Alert,
  AlertIcon,
  Avatar,
  Divider,
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
import React from "react";
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
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user } = session;

  const profile = await prisma.user.findUnique({
    where: { username: query.username.split("@")[1] },
    select: {
      name: true,
      username: true,
      image: true,
      linkedinLink: true,
      githubLink: true,
      email: true,
      bio: true,
      posts: {
        select: {
          content: true,
          slug: true,
          bannerImage: true,
          createdAt: true,
          title: true,
        },
      },
      communities: {
        where: {
          type: {
            not: "PRIVATE",
          },
        },
        select: {
          name: true,
          image: true,
        },
      },
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
      ownProfile: profile.username === user.username,
    },
  };
}

const UserProfile = ({ profile, ownProfile }) => {
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
          <div className="flex flex-col items-center justify-center pt-10 px-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-52 aspect-video h-48"
              src="https://cdn-icons-png.flaticon.com/512/5545/5545083.png"
              alt="not found"
            />
            <Alert
              status="warning"
              variant="left-accent"
              maxW="sm"
              colorScheme="purple">
              <AlertIcon />
              User not found
            </Alert>
          </div>
        ) : (
          <div className="flex gap-5 p-5 rounded-xl px-10 pt-10">
            <div className="w-[80%] flex flex-col gap-5">
              <h1 className="text-2xl font-medium">{profile.name}</h1>
              <Tabs variant="line">
                <TabList>
                  <Tab>Posts</Tab>
                  <Tab>Communities</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel className="h-[60vh] overflow-y-auto flex flex-col gap-5">
                    {profile.posts.map((p, idx) => (
                      <div
                        className="flex gap-3 px-4 py-2 border rounded-lg border-slate-300 justify-between items-center"
                        key={idx}>
                        <div className="flex-grow">
                          <Link
                            href={`/blog/${p.slug}`}
                            className="flex flex-col gap-1 md:gap-2 lg:gap-3 mb-2">
                            <h2 className="text-lg font-medium text-slate-900">
                              {p.title}
                            </h2>
                            <h3 className="text-base text-gray-500 max-w-sm line-clamp-2">
                              {p.content}
                            </h3>
                          </Link>
                          <div className="flex gap-2 items-center mt-2">
                            <span className="text-gray-500 text-xs lg:text-sm">
                              {format(new Date(p.createdAt), "MMM d")}
                            </span>
                          </div>
                        </div>
                        <Link href={`/blog/${p.slug}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.bannerImage}
                            className="rounded-md object-cover aspect-video w-32 h-24"
                            alt={p.title}
                          />
                        </Link>
                      </div>
                    ))}
                  </TabPanel>
                  <TabPanel className="flex flex-col gap-3">
                    {profile.communities.map((c, idx) => (
                      <div key={idx}>
                        <Link href={`/community/${c.id}`}>
                          <div className="flex gap-2 items-center p-2 rounded-xl">
                            <Avatar src={c.image} name={c.name} />
                            <h4>{c.name}</h4>
                          </div>
                        </Link>
                        {idx !== profile.communities.length - 1 ||
                          (profile.communities.length === 1 && (
                            <div className="border-2 m-1.5 border-slate-300 rounded-lg" />
                          ))}
                      </div>
                    ))}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
            <div className="w-[20%]">hello</div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
