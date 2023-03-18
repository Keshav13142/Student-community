import { fetchCommunities } from "@/lib/api-calls/community";
import {
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
            <h1 className="self-center text-2xl font-bold">
              Student <span className="text-purple-600">Community</span>
            </h1>
            <div className="flex flex-col items-center gap-5">
              <Link
                href="/community/discover"
                className="underline"
                onClick={onSidebarClose}
              >
                <Button tabIndex={-1} variant="link" color="purple.600">
                  Discover
                </Button>
              </Link>
              <Link href="/blog" className="underline" onClick={onSidebarClose}>
                <Button tabIndex={-1} variant="link" color="purple.600">
                  Blogs
                </Button>
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
          <div className="flex h-full max-w-md flex-col items-center justify-between border-r border-r-slate-200 p-3">
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center md:hidden">
                <div className="flex items-center gap-5">
                  <Link
                    href="/community/discover"
                    className="underline"
                    onClick={onSidebarClose}
                  >
                    <Button tabIndex={-1} variant="link" color="purple.600">
                      Discover
                    </Button>
                  </Link>
                  <Link
                    href="/blog"
                    className="underline"
                    onClick={onSidebarClose}
                  >
                    <Button tabIndex={-1} variant="link" color="purple.600">
                      Blogs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="block w-[80%] rounded-md border bg-slate-800 md:hidden" />
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-medium">Your communities</p>
                <Divider />
                {loading ? (
                  <LoadingSkeleton count={4} />
                ) : (
                  <div className="flex flex-col">
                    {communities === [] ? (
                      <h2>Communities you join will show up here!</h2>
                    ) : (
                      communities?.map((c, i) => (
                        <Link
                          key={c.id}
                          href={`/community/${c.slug}`}
                          onClick={onSidebarClose}
                        >
                          <p className="my-1 p-2 font-medium text-purple-600">
                            {`# ${c.name}`}
                          </p>
                          {i !== communities.length - 1 && <Divider />}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {session.data?.user?.isInstitutionAdmin && (
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="purple"
                  onClick={onCreateOpen}
                  leftIcon={<TbBrowserPlus fontSize={20} />}
                >
                  Create new community
                </Button>
              )}
              <Button
                w="full"
                variant="outline"
                colorScheme="purple"
                onClick={onJoinOpen}
                leftIcon={<RiUserAddLine />}
              >
                Have an invite code?
              </Button>
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
        </>
      )}
    </>
  );
};

export default SideBar;
