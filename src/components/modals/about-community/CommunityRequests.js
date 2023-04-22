import {
  getPendingCommRequests,
  managePendingCommRequests,
} from "@/lib/api-calls/community";
import { Avatar, Badge, IconButton, Switch, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TbUserCheck, TbUserX } from "react-icons/tb";

const CommunityRequests = ({ communityId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showPendingOnly, setShowPendingOnly] = useState(true);

  const { data } = useQuery(["community_requests", communityId], () =>
    getPendingCommRequests(communityId)
  );

  const mutation = useMutation(managePendingCommRequests, {
    onError: () => {
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community_requests", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["communityInfo", communityId],
      });
    },
  });

  const pendingReqLength = data?.filter((r) => r.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="mr-5 flex items-center gap-3 self-end">
        <span>Show pending only</span>
        <Switch
          isChecked={showPendingOnly}
          onChange={() => {
            setShowPendingOnly((prev) => !prev);
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        {showPendingOnly && pendingReqLength === 0 && (
          <span className="mt-2 text-lg text-blue-600">
            No pending requests
          </span>
        )}
        {data?.map(({ id, status, user }) => {
          if (showPendingOnly && status !== "PENDING") return null;
          return (
            <div
              key={id}
              className="flex min-w-full items-center justify-between gap-3 rounded-lg border border-purple-400 p-2 shadow-sm 
md:min-w-[80%]"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.image}
                  name={user?.name}
                  size={["sm", "md"]}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium md:text-base">
                    {user?.name}
                  </span>
                  <span className="cursor-pointer text-sm text-blue-700">{`@${user?.username}`}</span>
                </div>
              </div>
              {status === "APPROVED" && (
                <Badge
                  fontSize={["2xs", "xs"]}
                  className="mr-2"
                  variant="outline"
                  colorScheme="green"
                >
                  {status}
                </Badge>
              )}
              {status === "REJECTED" && (
                <Badge
                  fontSize={["2xs", "xs"]}
                  className="mr-2"
                  variant="outline"
                  colorScheme="red"
                >
                  {status}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                {status !== "APPROVED" && (
                  <IconButton
                    size={["sm", "md"]}
                    onClick={() => {
                      mutation.mutate({
                        communityId,
                        approvalId: id,
                        approvalStatus: true,
                      });
                    }}
                    isDisabled={mutation.isLoading}
                    icon={<TbUserCheck />}
                    colorScheme="green"
                    variant="outline"
                  />
                )}
                {status === "PENDING" && (
                  <IconButton
                    size={["sm", "md"]}
                    onClick={() => {
                      mutation.mutate({
                        communityId,
                        approvalId: id,
                        approvalStatus: false,
                      });
                    }}
                    isDisabled={status !== "PENDING" || mutation.isLoading}
                    icon={<TbUserX />}
                    colorScheme="red"
                    variant="outline"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityRequests;
