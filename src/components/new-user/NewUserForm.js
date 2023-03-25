import { createGuestUser, createUserProfile } from "@/lib/api-calls/user";
import { newUserFormSchema, parseZodErrors } from "@/lib/validations";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GoMarkGithub } from "react-icons/go";
import { GrLinkedin } from "react-icons/gr";
import { ImWarning } from "react-icons/im";
import { RiUser3Line } from "react-icons/ri";

const formFields = [
  {
    name: "username",
    rightElement: (
      <Popover
        placement="right-start"
        trigger="hover"
        openDelay={0}
        closeDelay={700}
      >
        <PopoverTrigger>
          <IconButton
            tabIndex="-1"
            _hover={{ bg: "transparent" }}
            icon={<ImWarning />}
            rounded="full"
            bg="transparent"
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent w="fit-content">
            <PopoverArrow />
            <PopoverHeader className="text-center font-medium">
              Username requirements
            </PopoverHeader>
            <PopoverBody>
              <div className="flex flex-col">
                <Text>- Must be unique</Text>
                <Text>- Lowercase Letters (a-z)</Text>
                <Text>- Numbers (0-9)</Text>
                <Text>- Dots (.)</Text>
                <Text>- Underscores (_)</Text>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    ),
    placeholder: "Username",
  },
  { name: "name", rightElement: <RiUser3Line />, placeholder: "Name" },
  { name: "bio", rightElement: null, placeholder: "Bio" },
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
  {
    name: "institutionCode",
    rightElement: (
      <Tooltip
        placement="right"
        label="Enter the unique code of the institution you belong to!"
        fontSize="md"
      >
        <span>
          <AiOutlineInfoCircle />
        </span>
      </Tooltip>
    ),
    placeholder: "Enter your code",
  },
];

const NewUserForm = () => {
  const toast = useToast();
  const router = useRouter();
  const {
    data: { user },
  } = useSession();

  if (user.hasProfile && user.enrollmentStatus === "APPROVED") {
    router.push("/discover");
  }

  const [formValues, setFormValues] = useState({
    name: user.name,
    username: "",
    bio: "",
    institutionCode: "",
    githubLink: "",
    linkedinLink: "",
  });

  const [formErrors, setFromErrors] = useState({
    name: null,
    username: null,
    institutionCode: null,
    githubLink: null,
    linkedinLink: null,
  });

  const newProfileMutation = useMutation(createUserProfile, {
    onError: ({
      response: {
        data: { error, ref },
      },
    }) => {
      if (ref) {
        setFromErrors((p) => ({ ...p, [ref]: error }));
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
      location.reload();
    },
  });

  const newGuestMutation = useMutation(createGuestUser, {
    onError: ({
      response: {
        data: { error, ref },
      },
    }) => {
      if (ref) {
        setFromErrors((p) => ({ ...p, [ref]: error }));
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
      location.reload();
    },
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFromErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check the form inputs for error
    let parsedInputs = newUserFormSchema.safeParse(formValues);

    // Map through the errors and get then in the right format
    if (!parsedInputs.success) {
      setFromErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    newProfileMutation.mutate(formValues);
  };

  return (
    <Tabs variant="line" colorScheme="purple" isFitted>
      <TabList>
        <Tab>New Profile</Tab>
        <Tab>Guest</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <form
            className="flex min-w-[25dvw] flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {formFields.map((f, idx) => (
              <InputGroup key={idx} className="flex flex-col">
                <Input
                  value={formValues[f.name]}
                  name={f.name}
                  placeholder={f.placeholder}
                  onChange={handleInputChange}
                />
                {f.rightElement && (
                  <InputRightElement>{f.rightElement}</InputRightElement>
                )}
                <span className="mt-1 text-red-400">{formErrors[f.name]}</span>
              </InputGroup>
            ))}
            <div className="flex flex-col gap-4">
              <Button
                isLoading={newProfileMutation.isLoading}
                loadingText="creating profile"
                type="submit"
                variant="solid"
                colorScheme="purple"
              >
                Join
              </Button>
              <Button
                type="button"
                variant="solid"
                colorScheme="gray"
                onClick={() => {
                  signOut({ redirect: false });
                }}
              >
                Logout
              </Button>
            </div>
          </form>
        </TabPanel>
        <TabPanel>
          <form
            className="flex min-w-[25dvw] flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <InputGroup className="flex flex-col">
              <Input
                value={formValues.institutionCode}
                name={"institutionCode"}
                placeholder={"Enter your code (optional)"}
                onChange={handleInputChange}
              />
              <span className="mt-1 text-red-400">
                {formErrors.institutionCode}
              </span>
            </InputGroup>
            <Button
              variant="solid"
              type="button"
              colorScheme="purple"
              loadingText="creating profile"
              size={["sm", "md"]}
              isLoading={newGuestMutation.isLoading}
              onClick={async () => {
                newGuestMutation.mutate({
                  institutionCode: formValues.institutionCode,
                });
              }}
            >
              Try as a guest
            </Button>
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default NewUserForm;
