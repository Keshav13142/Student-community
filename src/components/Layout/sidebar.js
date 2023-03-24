import { fetchCommunities } from "@/lib/api-calls/community";
import {
  Avatar,
  Button,
  Container,
  Divider,
  SkeletonText,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import { ImInfo } from "react-icons/im";
import { RiUserAddLine } from "react-icons/ri";
import { TbBrowserPlus } from "react-icons/tb";
import AboutInstitution from "../modals/about-institution";
import CreateCommunityModal from "../modals/create-community";
import JoinCommunity from "../modals/join-community";

const LoadingSkeleton = ({ count }) => {
  return (
    <>
      {[...new Array(count)].map((_, i) => (
        <Container key={i} padding="5" bg="gray.200" rounded="xl">
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="2" />
        </Container>
      ))}{" "}
    </>
  );
};

const SidebarButton = ({ icon, text, onClick }) => (
  <Button w="full" variant="outline" onClick={onClick} leftIcon={icon}>
    <span className="text-slate-500 dark:text-slate-400">{text}</span>
  </Button>
);

const SideBar = ({ onSidebarClose, showCommunityInfo }) => {
  const session = useSession();
  const toast = useToast();

  const {
    data: communities,
    error,
    loading,
  } = useQuery(["userCommunities"], fetchCommunities);

  const {
    isOpen: isAboutOpen,
    onClose: onAboutClose,
    onOpen: onAboutOpen,
  } = useDisclosure();

  const {
    isOpen: isCreateOpen,
    onClose: onCreateClose,
    onOpen: onCreateOpen,
  } = useDisclosure();

  const {
    isOpen: isJoinOpen,
    onClose: onJoinClose,
    onOpen: onJoinOpen,
  } = useDisclosure();

  if (error) {
    toast({
      title: "Unable to fetch your communities!!",
      description: "Please try refreshing the page!!",
      status: "error",
      duration: 4000,
      isClosable: true,
    });

    return null;
  }

  return (
    <>
      <AboutInstitution
        onClose={onAboutClose}
        isOpen={isAboutOpen}
        onSidebarClose={onSidebarClose}
      />
      {!showCommunityInfo ? (
        <div className="mt-10 mb-5 flex h-full flex-col justify-between">
          <div className="flex flex-col gap-10">
            <Link href="/discover" className="self-center">
              <h1 className="self-center text-2xl font-bold text-slate-700 dark:text-slate-300">
                Student{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  Community
                </span>
              </h1>
            </Link>
            <div className="flex flex-col items-center gap-5">
              <Link
                href="/discover"
                className="font-medium text-purple-600 hover:underline dark:text-purple-400"
              >
                Discover
              </Link>
              <Link
                href="/blog"
                className="font-medium text-purple-600 hover:underline dark:text-purple-400"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mx-2">
            <Button
              w="full"
              variant="outline"
              colorScheme="purple"
              onClick={onAboutOpen}
              leftIcon={<ImInfo />}
            >
              About Institution
            </Button>
          </div>
        </div>
      ) : (
        <>
          {session.data?.user?.isInstitutionAdmin && (
            <CreateCommunityModal
              onSidebarClose={onSidebarClose}
              onClose={onCreateClose}
              isOpen={isCreateOpen}
            />
          )}
          <JoinCommunity
            isOpen={isJoinOpen}
            onClose={onJoinClose}
            onSidebarClose={onSidebarClose}
          />
          <div className="flex h-full max-w-xs flex-col items-center justify-between border-r border-r-slate-200 p-3">
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center md:hidden">
                <div className="flex items-center gap-5">
                  <Link
                    href="/discover"
                    className="font-medium text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Discover
                  </Link>
                  <Link
                    href="/blog"
                    className="font-medium text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Blogs
                  </Link>
                </div>
              </div>
              <div className="block w-[80%] rounded-md border bg-slate-800 md:hidden" />
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-medium dark:text-slate-300">
                  Your communities
                </p>
                <Divider />
                {loading ? (
                  <LoadingSkeleton count={4} />
                ) : (
                  <div className="flex max-h-[50vh] grow flex-col overflow-y-auto md:max-h-[65vh]">
                    {communities === [] ? (
                      <h2>Communities you join will show up here!</h2>
                    ) : (
                      communities?.map((c, i) => (
                        <div key={c.id} className="flex flex-col gap-2">
                          <Link
                            href={`/community/${c.id}`}
                            className="flex items-center gap-2"
                            onClick={onSidebarClose}
                          >
                            <Avatar src={c.image} name={c.name} size="sm" />
                            <p className="p-2 font-medium text-purple-600 dark:text-slate-400">
                              {c.name}
                            </p>
                          </Link>
                          {i !== communities.length - 1 && (
                            <div className="my-1 w-full rounded-md border bg-slate-900" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              {session.data?.user?.isInstitutionAdmin && (
                <SidebarButton
                  onClick={onCreateOpen}
                  icon={
                    <TbBrowserPlus
                      fontSize={20}
                      className="text-slate-700 dark:text-slate-400"
                    />
                  }
                  text="Create new community"
                />
              )}
              <SidebarButton
                onClick={onJoinOpen}
                icon={
                  <RiUserAddLine className="text-slate-700 dark:text-slate-400" />
                }
                text="Have an invite code?"
              />
              <SidebarButton
                onClick={onAboutOpen}
                icon={<ImInfo className="text-slate-700 dark:text-slate-400" />}
                text="About Institution"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideBar;
