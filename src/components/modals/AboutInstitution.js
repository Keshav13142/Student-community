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

const AboutInstitution = ({ isOpen, onClose }) => {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About institution</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Hello from institution</ModalBody>

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

export default AboutInstitution;
