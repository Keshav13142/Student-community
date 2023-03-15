import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const EditProfile = ({ isOpen, onClose }) => {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          alignItems="center"
          gap={2}
          display="flex"
          justifyContent="center"
        >
          <div className="text-2xl">
            <span>Edit your profile</span>
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>Edit profile</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
