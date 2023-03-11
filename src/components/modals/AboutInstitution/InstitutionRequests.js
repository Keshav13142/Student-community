import {
  getPendingInstnRequests,
  managePendingInstnRequests,
} from "@/src/utils/api-calls/institution";
import {
  Avatar,
  Badge,
  Flex,
  IconButton,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TbUserCheck, TbUserX } from "react-icons/tb";

const InstitutionRequests = ({ institutionId }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showPendingOnly, setShowPendingOnly] = useState(true);

  const { data } = useQuery(["institution_requests", institutionId], () =>
    getPendingInstnRequests(institutionId)
  );

  const mutation = useMutation(managePendingInstnRequests, {
    onError: () => {
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["institution_requests", institutionId],
        (prev) => prev.map((r) => (r.id === data.id ? data : r))
      );
    },
  });

  const pendingReqLength = data?.filter((r) => r.status === "PENDING").length;

  return (
    <Stack>
      <Flex alignItems="center" alignSelf="flex-end" mr={5} gap={3}>
        <span>Show pending only</span>
        <Switch
          isChecked={showPendingOnly}
          onChange={() => {
            setShowPendingOnly((prev) => !prev);
          }}
        />
      </Flex>
      <Stack spacing={3} alignItems="center">
        {showPendingOnly && pendingReqLength === 0 && (
          <span className="text-lg mt-2 text-blue-600">
            No pending requests
          </span>
        )}
        {data?.map(({ id, status, user }) => {
          if (showPendingOnly && status !== "PENDING") return null;
          return (
            <Flex
              minW="sm"
              key={id}
              p={2}
              className="border border-purple-400 rounded-lg shadow-sm"
              justifyContent="space-between"
              alignItems="center">
              <Flex alignItems="center" gap={5}>
                <Avatar src={user.image} name={user.name} />
                <Stack>
                  <span className="text-base font-medium">{user.name}</span>
                  <span className="text-blue-700 cursor-pointer">{`@${user.username}`}</span>
                </Stack>
              </Flex>
              {status !== "PENDING" && (
                <Badge
                  className="mr-2"
                  variant="outline"
                  colorScheme={status === "REJECTED" ? "red" : "green"}>
                  {status}
                </Badge>
              )}
              <Flex alignItems="center" gap={3}>
                <IconButton
                  onClick={() => {
                    mutation.mutate({
                      institutionId,
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
                      institutionId,
                      approvalId: id,
                      approvalStatus: false,
                    });
                  }}
                  isDisabled={status !== "PENDING" || mutation.isLoading}
                  icon={<TbUserX />}
                  colorScheme="red"
                  variant="outline"
                />
              </Flex>
            </Flex>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default InstitutionRequests;
