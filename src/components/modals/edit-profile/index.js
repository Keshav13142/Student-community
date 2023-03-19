import { getProfileData, updateUserProfile } from "@/lib/api-calls/user";
import { parseZodErrors, updateProfileSchema } from "@/lib/validations";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GoMarkGithub } from "react-icons/go";
import { GrLinkedin } from "react-icons/gr";
import { RiUser3Line } from "react-icons/ri";

const formFields = [
  {
    name: "username",
    rightElement: null,
    placeholder: "Username",
  },
  { name: "name", rightElement: <RiUser3Line />, placeholder: "Name" },
  { name: "bio", rightElement: null, placeholder: "Bio" },
  { name: "image", rightElement: <CgProfile />, placeholder: "Image" },
  {
    name: "githubLink",
    rightElement: <GoMarkGithub />,
    placeholder: "Github link",
  },
  {
    name: "linkedinLink",
    rightElement: <GrLinkedin />,
    placeholder: "LinkedIn link",
  },
];

const EditProfile = ({ isOpen, onClose }) => {
  const toast = useToast();
  const session = useSession();

  const mutation = useMutation(updateUserProfile, {
    onError: ({
      response: {
        data: { error, ref },
      },
    }) => {
      if (ref) {
        setErrors((p) => ({ ...p, [ref]: error }));
      } else {
        toast({
          title: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Updated profile",
        description: "Refresh to see changes",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    },
  });

  const { data: profile } = useQuery(
    [session.data?.user?.username],
    getProfileData
  );

  useEffect(() => {
    if (profile) {
      setInputs((p) => ({ ...p, ...profile }));
    }
  }, [profile]);

  const [inputs, setInputs] = useState({
    name: profile?.name,
    username: profile?.username,
    image: profile?.image,
    bio: profile?.bio,
    githubLink: profile?.githubLink,
    linkedinLink: profile?.linkedinLink,
  });

  const [errors, setErrors] = useState({
    name: null,
    username: null,
    image: null,
    bio: null,
    githubLink: null,
    linkedinLink: null,
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check the form inputs for error
    let parsedInputs = updateProfileSchema.safeParse(inputs);

    // Map through the errors and get then in the right format
    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate(inputs);
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size={["xs", "sm", "md", "xl"]}
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
          <h2 className="text-xl md:text-2xl">Edit your profile</h2>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form className="flex flex-col gap-3">
            {formFields.map((f, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="mb-1 font-medium">{f.placeholder}</span>
                <InputGroup>
                  <Input
                    value={inputs[f.name]}
                    name={f.name}
                    _placeholder={{ color: "#1a1b26" }}
                    placeholder={f.placeholder}
                    onChange={handleInputChange}
                  />
                  {f.rightElement && (
                    <InputRightElement>{f.rightElement}</InputRightElement>
                  )}
                </InputGroup>
                <span className="mt-1 text-red-400">{errors[f.name]}</span>
              </div>
            ))}
            <div className="mt-3 flex gap-5 self-center">
              <Button
                type="button"
                variant="outline"
                colorScheme="red"
                size={["sm", "md"]}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                isLoading={mutation.isLoading}
                loadingText="updating`"
                type="submit"
                variant="solid"
                colorScheme="purple"
                size={["sm", "md"]}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
