import {
  Avatar,
  Button,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import AboutCommunity from "../modals/AboutCommunity";

const CommunityTopBar = ({ data, isDisabled }) => {
  const router = useRouter();

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
        className="shadow-sm">
        <Flex gap={4} align="center">
          <IconButton
            bg="transparent"
            icon={<FaChevronLeft />}
            onClick={() => {
              router.push("/home");
            }}
          />
          <Avatar src={data?.image} />
          <h3 className="text-xl font-medium">{data?.name}</h3>
        </Flex>
        <Flex alignItems="center" gap={5}>
          {isDisabled && (
            <Button variant="outline" colorScheme="purple" size="sm">
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
