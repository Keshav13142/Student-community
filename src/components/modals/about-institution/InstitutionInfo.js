import { getInstInviteCodes } from "@/lib/api-calls/institution";
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
import Image from "next/image";
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
    <div className="flex min-w-[60%] gap-5">
      <span>{title} Code</span>
      <Input value={code} type="password" isReadOnly variant="flushed" />
      <IconButton icon={<FiCopy />} onClick={copyToClipboard} />
    </div>
  );
};

const InstitutionInfo = ({ data }) => {
  const session = useSession();

  const { data: inviteCodes } = useQuery(
    ["institutionInviteCodes"],
    getInstInviteCodes,
    {
      enabled: session.data?.user?.isInstitutionAdmin,
    }
  );

  return (
    <div className="flex flex-col items-center gap-5">
      <Image
        src="https://illustrations.popsy.co/violet/business-analysis.svg"
        alt="default community"
        className="object-cover"
        width={200}
        height={200}
      />
      <div>
        Name :<span className="text-xl font-bold">{data?.name}</span>
      </div>
      <div>
        Website :
        <span className="text-xl font-bold">
          {data?.website || "Not provided"}
        </span>
      </div>
      <div>
        Support email :
        <span className="text-xl font-bold">
          {data?.supportEmail || "Not provided"}
        </span>
      </div>
      {session?.data?.user?.isInstitutionAdmin && (
        <>
          <InviteCode code={inviteCodes?.adminCode} title="Admin" />
          <InviteCode code={inviteCodes?.memberCode} title="Member" />
        </>
      )}
    </div>
  );
};

export default InstitutionInfo;
