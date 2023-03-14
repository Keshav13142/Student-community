import { getInstInviteCodes } from "@/src/utils/api-calls/institution";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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

const InstitutionInfo = ({ data }) => {
  const { data: inviteCodes } = useQuery(
    ["institutionInviteCodes"],
    getInstInviteCodes,
    {
      enabled: Boolean(data?.isCurrentUserAdmin),
    }
  );

  const session = useSession();
  return (
    <Stack flexDirection="column" gap={5} alignItems="center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-36 w-36 rounded-xl"
        src={
          data?.image ||
          "http://vastusanskar.com/wp-content/uploads/2019/02/government-institution.jpg"
        }
        alt="instituion image"
      />
      <Box>
        Name :<span className="text-xl font-bold">{data?.name}</span>
      </Box>
      <Box>
        Website :
        <span className="text-xl font-bold">
          {data?.website || "Not provided"}
        </span>
      </Box>
      <Box>
        Support email :
        <span className="text-xl font-bold">
          {data?.supportEmail || "Not provided"}
        </span>
      </Box>
      {session?.data?.user?.isInstitutionAdmin && (
        <>
          <InviteCode code={inviteCodes?.adminCode} title="Admin" />
          <InviteCode code={inviteCodes?.memberCode} title="Member" />
        </>
      )}
    </Stack>
  );
};

export default InstitutionInfo;
