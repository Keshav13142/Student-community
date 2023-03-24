import {
  joinPublicCommunity,
  requestToJoinCommunity,
} from "@/lib/api-calls/community";
import {
  Avatar,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import AboutCommunity from "../modals/about-community";

const CommunityTopBar = ({ data, isDisabled }) => {
  const router = useRouter();
  const toast = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const [isRequestDisabled, setIsRequestDisabled] = useState(false);

  const requestMutation = useMutation(requestToJoinCommunity, {
    onError: (error) => {
      setIsRequestDisabled(true);
      toast({
        title: error.response.data.error,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      setIsRequestDisabled(true);
      toast({
        title: "A request has been sent to the admin!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const joinMutation = useMutation(joinPublicCommunity, {
    onError: () => {
      toast({
        title: "Something went wrong!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityInfo", data.id] });
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });

      toast({
        title: `Joined ${data.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const {
    isOpen: isAboutOpen,
    onClose: onAboutClose,
    onOpen: onAboutOpen,
  } = useDisclosure();

  return (
    <>
      <AboutCommunity data={data} isOpen={isAboutOpen} onClose={onAboutClose} />
      <div className="flex items-center justify-between border-b-2 border-b-slate-200 p-2 dark:border-b-slate-800">
        <div className="flex items-center gap-2 md:gap-4">
          <IconButton
            size="sm"
            bg="transparent"
            icon={<FaChevronLeft />}
            onClick={() => {
              router.push("/discover");
            }}
          />
          <Avatar src={data?.image} size={["sm", "md"]} />
          <h3 className="flex text-base font-medium dark:text-slate-300 md:text-xl">
            {data?.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isDisabled && !isRequestDisabled && (
            <Button
              onClick={() => {
                requestMutation.mutate(data.id);
              }}
              isLoading={requestMutation.isLoading}
              variant="outline"
              colorScheme="purple"
              size="sm"
            >
              Request to Join
            </Button>
          )}
          {data.type === "PUBLIC" &&
            !data.members.find((m) => m.user.id === session.data?.user.id) && (
              <Button
                onClick={() => {
                  joinMutation.mutate(data.id);
                }}
                isLoading={joinMutation.isLoading}
                variant="outline"
                colorScheme="purple"
                size="sm"
              >
                Join
              </Button>
            )}
          <IconButton
            icon={<ImInfo />}
            onClick={onAboutOpen}
            colorScheme="purple"
            variant="outline"
            size="sm"
          />
        </div>
      </div>
    </>
  );
};

export default CommunityTopBar;
