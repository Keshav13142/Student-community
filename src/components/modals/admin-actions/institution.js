import { manageInstnAdmin } from "@/lib/api-calls/institution";
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
  "remove-from-instn": {
    title: "Remove from institution",
    desc: "This will remove the user COMPLETELY from the institution",
    warning: "This action cannot be reverted!!",
    type: "error",
  },
  "remove-from-admin": {
    title: "Remove user from admin group",
    warning: "This will revoke all admin rights of the user",
    type: "error",
  },
};

const toastOptions = {
  title: "Something went wrong!😢",
  status: "error",
  duration: 5000,
  isClosable: true,
};

const InstitutionAdminActions = ({
  isOpen,
  onClose,
  institutionId,
  action: { type, userId },
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(manageInstnAdmin, {
    onError: () => {
      toast(toastOptions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutInstitution"] });
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleAction = () => {
    const data = { userId, institutionId };
    if (type === "promote-to-admin") {
      mutation.mutate({ ...data, action: "promote" });
    }
    if (type === "remove-from-admin") {
      mutation.mutate({ ...data, action: "revoke" });
    }
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
            colorScheme="red"
            variant={"outline"}
            mr={3}
            isLoading={mutation.isLoading}
            onClick={handleAction}
          >
            Proceed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InstitutionAdminActions;
