import { requestToJoinCommunity } from "@/lib/api-calls/community";
import {
  Avatar,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import AboutCommunity from "../modals/about-community";

const CommunityTopBar = ({ data, isDisabled }) => {
  const router = useRouter();
  const toast = useToast();

  const [isRequestDisabled, setIsRequestDisabled] = useState(false);

  const mutation = useMutation(requestToJoinCommunity, {
    onError: (error) => {
      setIsRequestDisabled(true);
      toast({
        title: error.response.data.error,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      setIsRequestDisabled(true);
      toast({
        title: "A request has been sent to the admin!",
        status: "info",
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
      <div className="flex items-center justify-between border-b-2 border-b-slate-200 p-2">
        <div className="flex items-center gap-2 md:gap-4">
          <IconButton
            size="sm"
            bg="transparent"
            icon={<FaChevronLeft />}
            onClick={() => {
              router.push("/community/discover");
            }}
          />
          <Avatar src={data?.image} size={["sm", "md"]} />
          <h3 className="flex text-base font-medium md:text-xl">
            {data?.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isDisabled && !isRequestDisabled && (
            <Button
              onClick={() => {
                mutation.mutate(data.id);
              }}
              isLoading={mutation.isLoading}
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
