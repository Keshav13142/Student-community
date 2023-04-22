import { IconButton, Input, useToast } from "@chakra-ui/react";
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
    <div className="flex flex-col justify-start">
      <span className="text-sm md:text-base">{title} Code</span>
      <div className="flex items-center gap-2">
        <Input
          value={code}
          type="password"
          isReadOnly
          variant="flushed"
          className="max-w-fit"
        />
        <IconButton
          icon={<FiCopy size={15} />}
          onClick={copyToClipboard}
          size={["xs", "sm"]}
        />
      </div>
    </div>
  );
};

export default InviteCode;
