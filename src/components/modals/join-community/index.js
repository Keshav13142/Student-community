import { joinCommunityWithCode } from "@/lib/api-calls/community";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ isExistingUser, redirect }) => {
      if (isExistingUser) {
        router.push(redirect);
        toast({
          title: "You are already a member",
          status: "info",
          duration: 2500,
          isClosable: true,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
        toast({
          title: "Joined community sucessfully",
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
    <Modal isOpen={isOpen} onClose={onClose} size={["xs", "sm", "md"]}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          <h1 className="text-2xl">Join a community</h1>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
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
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JoinCommunity;
