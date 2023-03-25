import { Badge } from "@chakra-ui/react";
import Image from "next/image";
import InviteCode from "../../invite-code";

const CommunityInfo = ({ data, code }) => {
  return (
    <div className="mx-auto flex max-w-fit flex-col gap-5 text-base font-medium text-slate-600 dark:text-slate-300 md:text-lg">
      <Image
        src="https://illustrations.popsy.co/violet/student-with-diploma.svg"
        alt="default community"
        className="self-center object-cover"
        width={300}
        height={300}
      />
      <div className="flex items-center gap-2">
        <span>Type :</span>
        <Badge
          fontSize={["2xs", "xs"]}
          className="max-w-fit text-base"
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
      <div className="flex flex-col">
        <span>Description :</span>
        <span className="font-normal text-slate-600 dark:text-slate-400">
          {" "}
          {data?.desc || "Not provided"}
        </span>
      </div>
      {data.isCurrentUserAdmin && <InviteCode code={code} title="Invite" />}
    </div>
  );
};

export default CommunityInfo;
