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
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["community_requests", communityId], (prev) =>
        prev.map((r) => (r.id === data.id ? data : r))
      );
    },
  });

  const pendingReqLength = data?.filter((r) => r.status === "PENDING").length;

  return (
    <div className="flex flex-col">
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
              className="flex items-center justify-between rounded-lg border border-purple-400 p-2 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <Avatar src={user?.image} name={user?.name} />
                <div className="flex flex-col">
                  <span className="text-base font-medium">{user?.name}</span>
                  <span className="cursor-pointer text-blue-700">{`@${user?.username}`}</span>
                </div>
              </div>
              {status !== "PENDING" && (
                <Badge
                  className="mr-2"
                  variant="outline"
                  colorScheme={status === "REJECTED" ? "red" : "green"}
                >
                  {status}
                </Badge>
              )}
              <div className="flex items-center gap-3">
                <IconButton
                  onClick={() => {
                    mutation.mutate({
                      communityId,
                      approvalId: id,
                      approvalStatus: true,
                    });
                  }}
                  isDisabled={status === "APPROVED" || mutation.isLoading}
                  icon={<TbUserCheck />}
                  colorScheme="green"
                  variant="outline"
                />
                <IconButton
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityRequests;
