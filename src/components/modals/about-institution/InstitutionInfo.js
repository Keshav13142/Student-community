import { getInstInviteCodes } from "@/lib/api-calls/institution";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import InviteCode from "../../invite-code";

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
    <div className="mx-auto flex max-w-fit flex-col gap-5 text-base font-medium text-slate-600 dark:text-slate-300 md:text-lg">
      <div className="flex flex-col">
        <span>Name :</span>
        <span className="font-normal text-slate-600 dark:text-slate-400">
          {data?.name}
        </span>
      </div>
      <div className="flex flex-col">
        <span>Website :</span>
        {!data.website ? (
          <span className="font-normal text-slate-600 dark:text-slate-400">
            {"Not provided"}
          </span>
        ) : (
          <a
            target="_blank"
            className="font-normal text-slate-600 hover:text-blue-500 hover:underline dark:text-slate-400 dark:hover:text-blue-400"
            href={data.website}
          >
            {data.website}
          </a>
        )}
      </div>
      <div className="flex flex-col">
        <span>Support email :</span>
        {!data.supportEmail ? (
          <span className="font-normal text-slate-600 dark:text-slate-400">
            {"Not provided"}
          </span>
        ) : (
          <a
            className="font-normal text-slate-600 hover:text-blue-500 hover:underline dark:text-slate-400 dark:hover:text-blue-400"
            href={`mailto:${data.supportEmail}`}
          >
            {data.supportEmail}
          </a>
        )}
      </div>
      {session?.data?.user?.isInstitutionAdmin &&
        inviteCodes?.map((item, id) => (
          <InviteCode code={item.code} title={item.type} key={id} />
        ))}
    </div>
  );
};

export default InstitutionInfo;
