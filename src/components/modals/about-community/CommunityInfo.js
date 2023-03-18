import { Badge, IconButton, Input, useToast } from "@chakra-ui/react";
import Image from "next/image";
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

const CommunityInfo = ({ data, code }) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <Image
        src="https://illustrations.popsy.co/violet/student-with-diploma.svg"
        alt="default community"
        className="object-cover"
        width={300}
        height={300}
      />
      <div className="font-bold">
        Type :
        <Badge
          className="ml-2 text-base"
          variant="outline"
          color={
            data.type === "PUBLIC"
              ? "whatsapp.400"
              : data.type === "PRIVATE"
              ? "red.500"
              : "blue.300"
          }
        >
          {data.type}
        </Badge>
      </div>
      <div className="font-bold">
        Description :
        <span className="font-normal"> {data?.desc || "Not provided"}</span>
      </div>
      {data.isCurrentUserAdmin && <InviteCode code={code} title="Invite" />}
    </div>
  );
};

export default CommunityInfo;
