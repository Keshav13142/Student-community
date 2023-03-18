import { createCommunity } from "@/lib/api-calls/community";
import { createCommunitySchema, parseZodErrors } from "@/lib/validations";
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
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

const CreateCommunityModal = ({ isOpen, onClose, onSidebarClose }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
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
    onSuccess: ({ redirect }) => {
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
      queryClient.invalidateQueries({ queryKey: ["publicCommunities"] });
      onClose();
      onSidebarClose();
      toast({
        title: "Created community successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(redirect);
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
    let parsedInputs = createCommunitySchema.safeParse(details);

    // Map through the errors and get then in the right format
    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate(details);
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new Community</ModalHeader>
        <ModalCloseButton disabled={mutation.isLoading} />
        <ModalBody>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-5">
              <InputGroup className="flex flex-col">
                <Input
                  name="name"
                  _placeholder={{ color: "#1a1b26" }}
                  placeholder="Community name"
                  onChange={handleInputChange}
                />
                <span className="mt-1 text-red-400">{errors.name}</span>
              </InputGroup>
              <Input
                name="desc"
                _placeholder={{ color: "#1a1b26" }}
                placeholder="Description"
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
                <span className="mt-1 text-red-400">{errors.image}</span>
              </InputGroup>
              <RadioGroup
                defaultValue="PUBLIC"
                name="type"
                onChange={(v) => {
                  setDetails((p) => ({ ...p, type: v }));
                }}
              >
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Community type</p>
                  <Radio value="PUBLIC">Public</Radio>
                  <Radio value="PRIVATE">Private</Radio>
                  <Radio value="RESTRICTED">Restricted</Radio>
                </div>
              </RadioGroup>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isLoading={mutation.isLoading}
            onClick={onSubmit}
            colorScheme="purple"
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;
