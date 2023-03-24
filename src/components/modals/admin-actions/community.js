import { updateCommunityRoles } from "@/lib/api-calls/community";
import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const options = {
  "promote-to-admin": {
    title: "Grant admin priviledges",
    warning:
      "This will provide the selected user All admin rights, Please be aware!!",
    type: "info",
  },
  "promote-to-mod": {
    title: "Grant Moderator priviledges",
    warning:
      "This will provide the selected user All Moderator rights, Please be aware!!",
    type: "info",
  },
  "remove-from-mod": {
    title: "Revoke Moderator priviledges",
    warning: "This user will no longer be a moderator!",
    type: "error",
  },
  "remove-from-admin": {
    title: "Remove user from admin group",
    warning: "This will revoke all admin rights of the user",
    type: "error",
  },
};

const getRoleAction = (str) => {
  const split = str.split("-");
  return {
    role: split[2],
    action: split[0],
  };
};

const toastOptions = {
  title: "Something went wrong!😢",
  status: "error",
  duration: 3000,
  isClosable: true,
};

const CommunityActions = ({
  isOpen,
  onClose,
  communityId,
  action: { type, memberId },
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(updateCommunityRoles, {
    onError: () => {
      toast(toastOptions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityInfo", communityId],
      });
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleAction = () => {
    mutation.mutate({ memberId, communityId, ...getRoleAction(type) });
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2xl">
          {options[type]?.title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status={options[type]?.type} rounded="md">
            <AlertIcon />
            {options[type]?.warning}
          </Alert>
          {options[type]?.desc ? (
            <Alert status={options[type]?.type} mt={2} rounded="md">
              <AlertIcon />
              {options[type]?.desc}
            </Alert>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={mutation.isLoading}
            colorScheme="red"
            variant={"outline"}
            mr={3}
            onClick={handleAction}
          >
            Proceed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommunityActions;
