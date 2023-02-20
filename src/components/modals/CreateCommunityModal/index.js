import { createCommunity } from "@/src/utils/api-calls";
import { createCommunitySchema } from "@/src/utils/zod_schemas";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";

const CreateCommunityModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const toast = useToast();

  const mutation = useMutation(createCommunity, {
    onError: ({
      response: {
        data: { error },
      },
    }) => {
      toast({
        title: error,
        status: "error",
        description: "Unable to create community",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("userCommunities");
      queryClient.invalidateQueries("publicCommunities");
      onClose();
      toast({
        title: "Created community successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const [details, setDetails] = useState({
    name: "",
    image: "",
    desc: "",
    type: "PUBLIC",
  });

  const [errors, setErrors] = useState({
    name: null,
    image: null,
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Check the form inputs for error
    let zodError = createCommunitySchema.safeParse(details);

    // Map through the errors and get then in the right format
    if (!zodError.success) {
      let errors = {};

      zodError.error.issues.forEach((e) => {
        errors[e.path[0]] = e.message;
      });

      setErrors((p) => ({ ...p, ...errors }));

      return;
    }

    mutation.mutate(details);
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new Community</ModalHeader>
        <ModalCloseButton disabled={mutation.isLoading} />
        <ModalBody>
          <form onSubmit={onSubmit}>
            <Stack spacing={5}>
              <InputGroup className="flex flex-col">
                <Input
                  name="name"
                  _placeholder={{ color: "#1a1b26" }}
                  placeholder="Community name"
                  onChange={handleInputChange}
                />
                <span className="text-red-400 mt-1">{errors.name}</span>
              </InputGroup>
              <Input
                name="desc"
                _placeholder={{ color: "#1a1b26" }}
                placeholder="Description"
                as="textarea"
                onChange={handleInputChange}
              />
              <InputGroup className="flex flex-col">
                <Input
                  name="image"
                  _placeholder={{ color: "#1a1b26" }}
                  placeholder="Logo link"
                  onChange={handleInputChange}
                />
                <InputRightElement>
                  <BsFillImageFill />
                </InputRightElement>
                <span className="text-red-400 mt-1">{errors.image}</span>
              </InputGroup>
              <RadioGroup
                defaultValue="PUBLIC"
                name="type"
                onChange={(v) => {
                  setDetails((p) => ({ ...p, type: v }));
                }}>
                <Stack spacing={3}>
                  <Text className="font-medium">Community type</Text>
                  <Radio value="PUBLIC">Public</Radio>
                  <Radio value="PRIVATE">Private</Radio>
                  <Radio value="RESTRICTED">Restricted</Radio>
                </Stack>
              </RadioGroup>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            variant="outline"
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={mutation.isLoading}
            onClick={onSubmit}
            colorScheme="purple">
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;
