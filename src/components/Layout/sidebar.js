import { fetchCommunities } from "@/lib/api-calls/community";
import {
  Button,
  Container,
  Divider,
  Flex,
  SkeletonText,
  Stack,
  Text,
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

const SideBar = () => {
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
      <AboutInstitution onClose={onAboutClose} isOpen={isAboutOpen} />
      {session.data?.user?.isInstitutionAdmin && (
        <CreateCommunityModal onClose={onCreateClose} isOpen={isCreateOpen} />
      )}
      <JoinCommunity isOpen={isJoinOpen} onClose={onJoinClose} />
      <Stack
        className="border-r border-r-slate-200"
        maxW="md"
        minW="2xs"
        alignItems="center"
        justifyContent="space-between"
        height="full"
        p={3}
      >
        <Stack spacing={2} w="full" alignItems="center">
          <Text className="text-2xl font-medium">Your communities</Text>
          <Divider />
          {loading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <Stack>
              {communities === [] ? (
                <h2>Communities you join will show up here!</h2>
              ) : (
                communities?.map((c, i) => (
                  <Link key={c.id} href={`/community/${c.slug}`}>
                    <Flex
                      paddingY={2}
                      display="flex"
                      justifyContent="flex-start"
                      paddingX={2}
                      gap={2}
                      alignItems="center"
                      w="full"
                      textColor="purple.600"
                    >
                      <span className="font-medium ">{`# ${c.name}`}</span>
                    </Flex>
                    {i !== communities.length - 1 && <Divider />}
                  </Link>
                ))
              )}
            </Stack>
          )}
        </Stack>
        <Stack w="full" spacing={3}>
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
        </Stack>
      </Stack>
    </>
  );
};

export default SideBar;
