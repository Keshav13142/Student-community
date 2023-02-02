import { AppContext } from "@/src/context/AppContext";
import { fetchCommunities } from "@/src/utils/api-calls";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useState } from "react";
import { ImInfo } from "react-icons/im";
import { TbBrowserPlus } from "react-icons/tb";
import { useQuery } from "react-query";
import AboutInstitution from "../modals/AboutInstitution";
import CreateCommunityModal from "../modals/CreateCommunityModal";
import Loading from "./Loading";

const SideBar = () => {
  const toast = useToast();

  const {
    data: communities,
    error,
    loading,
  } = useQuery("userCommunities", fetchCommunities);

  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);

  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] =
    useState(false);

  const { isInstitutionAdmin } = useContext(AppContext);

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
        isAdmin={isInstitutionAdmin}
        onClose={() => {
          setIsInstitutionModalOpen(false);
        }}
        isOpen={isInstitutionModalOpen}
      />
      <CreateCommunityModal
        onClose={() => {
          setIsCreateCommunityModalOpen(false);
        }}
        isOpen={isCreateCommunityModalOpen}
      />
      <Stack
        className="border-r border-r-slate-200"
        maxW="md"
        minW="xs"
        alignItems="center"
        justifyContent="space-between"
        height="full"
        p={3}>
        <Stack spacing={2} w="full" alignItems="center">
          <Text className="text-2xl font-medium">Your communities</Text>
          <Divider />
          {loading ? (
            <Loading count={4} />
          ) : (
            <Stack>
              {communities === [] ? (
                <h2>Communities you join will show up here!</h2>
              ) : (
                communities?.map((c, i) => (
                  <Link key={c.id} href={`/community/${c.id}`}>
                    <Flex
                      paddingY={2}
                      display="flex"
                      justifyContent="flex-start"
                      paddingX={2}
                      gap={2}
                      alignItems="center"
                      w="full"
                      textColor="purple.600">
                      <Avatar size="sm" src={c.image} name={c.name} />
                      <span className="font-medium ">{c.name}</span>
                    </Flex>
                    {i !== communities.length - 1 && <Divider />}
                  </Link>
                ))
              )}
            </Stack>
          )}
        </Stack>
        <Stack w="full" spacing={3}>
          {isInstitutionAdmin && (
            <Button
              w="full"
              variant="outline"
              colorScheme="purple"
              onClick={() => {
                setIsCreateCommunityModalOpen(true);
              }}
              leftIcon={<TbBrowserPlus fontSize={20} />}>
              Create new commuinity
            </Button>
          )}
          <Button
            w="full"
            variant="outline"
            colorScheme="purple"
            onClick={() => {
              setIsInstitutionModalOpen(true);
            }}
            leftIcon={<ImInfo />}>
            About Institution
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default SideBar;
