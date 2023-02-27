import {
  Badge,
  Box,
  Flex,
  IconButton,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { FiCopy } from "react-icons/fi";

const InviteCode = ({ code, title }) => {
  const toast = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied to clipboard!",
      status: "success",
      orientation: "vertical",
      position: "top",
      duration: 1000,
      isClosable: true,
      variant: "subtle",
    });
  };
  return (
    <Flex minW="60%" gap={5}>
      <span>{title} Code</span>
      <Input value={code} type="password" isReadOnly variant="flushed" />
      <IconButton icon={<FiCopy />} onClick={copyToClipboard} />
    </Flex>
  );
};

const CommunityInfo = ({ data, code }) => {
  return (
    <Stack flexDirection="column" gap={5} alignItems="center">
      <img
        className="w-36 h-3w-36 rounded-xl"
        src={
          data?.image ||
          "https://img-cdn.inc.com/image/upload/w_1920,h_1080,c_fill/images/panoramic/GettyImages-1011930076_460470_i7oi1u.jpg"
        }
        alt="instituion image"
      />
      <Box className="font-bold">
        Type :
        <Badge
          className="text-base ml-2"
          variant="outline"
          color={
            data.type === "PUBLIC"
              ? "whatsapp.400"
              : data.type === "PRIVATE"
              ? "red.500"
              : "blue.300"
          }>
          {data.type}
        </Badge>
      </Box>
      <Box className="font-bold">
        Description :
        <span className="font-normal"> {data?.desc || "Not provided"}</span>
      </Box>
      {data.isCurrentUserAdmin && <InviteCode code={code} title="Invite" />}
    </Stack>
  );
};

export default CommunityInfo;
