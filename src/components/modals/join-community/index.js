import { joinCommunityWithCode } from "@/lib/api-calls/community";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { isCuid } from "@paralleldrive/cuid2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdVpnKey } from "react-icons/md";

const JoinCommunity = ({ isOpen, onClose, onSidebarClose }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(joinCommunityWithCode, {
    onError: (error) => {
      toast({
        title: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: ({ isExistingUser, data, redirect }) => {
      if (isExistingUser) {
        router.push(redirect);
        toast({
          title: `You are already a member`,
          status: "info",
          duration: 2500,
          isClosable: true,
        });
      } else {
        queryClient.setQueryData(["userCommunities"], (prev) => [
          ...prev,
          data,
        ]);
        toast({
          title: `Welcome to ${data.name}`,
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        router.push(redirect);
      }
      onClose();
      onSidebarClose();
      setInviteCode("");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!isCuid(inviteCode)) {
      setError("Enter a valid invite code!");
      return;
    }

    mutation.mutate({ inviteCode });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          <h1 className="text-2xl">Join a community</h1>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <div className="flex flex-col">
                <span className="mb-1 font-medium">Invite code</span>
                <InputGroup>
                  <Input
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      setError(null);
                    }}
                  />
                  <InputRightElement>
                    <MdVpnKey />
                  </InputRightElement>
                  <span className="mm-1 tt-1 text-re">{error}</span>
                </InputGroup>
              </div>
              <Flex alignSelf="center" gap={3}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    onClose();
                    setInviteCode("");
                  }}
                  type="button"
                >
                  Close
                </Button>
                <Button
                  colorScheme="purple"
                  type="submit"
                  isLoading={mutation.isLoading}
                >
                  Join
                </Button>
              </Flex>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JoinCommunity;
