import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const CreateCommunityModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new Community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Hello from create community</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;
