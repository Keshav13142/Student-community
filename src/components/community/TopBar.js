import { requestToJoinCommunity } from "@/src/utils/api-calls/community";
import {
  Avatar,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import AboutCommunity from "../modals/AboutCommunity";

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
      <Flex
        px={2}
        py={2}
        alignItems="center"
        justifyContent="space-between"
        className="shadow-sm"
      >
        <Flex gap={4} align="center">
          <IconButton
            bg="transparent"
            icon={<FaChevronLeft />}
            onClick={() => {
              router.push("/community/discover");
            }}
          />
          <Avatar src={data?.image} />
          <h3 className="text-xl font-medium">{data?.name}</h3>
        </Flex>
        <Flex alignItems="center" gap={5}>
          {isDisabled && (
            <Button
              onClick={() => {
                mutation.mutate(data.id);
              }}
              isLoading={mutation.isLoading}
              variant="outline"
              colorScheme="purple"
              size="sm"
              isDisabled={isRequestDisabled}
            >
              Request to join
            </Button>
          )}
          <IconButton
            icon={<ImInfo />}
            onClick={onAboutOpen}
            colorScheme="purple"
            variant="outline"
            size="sm"
          />
        </Flex>
      </Flex>
    </>
  );
};

export default CommunityTopBar;
