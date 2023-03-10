import { createUserProfile } from "@/src/utils/api-calls/user";
import { newUserFormSchema, parseZodErrors } from "@/src/utils/zod_schemas";
import {
  Button,
  Flex,
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
  Radio,
  RadioGroup,
  Stack,
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
        closeDelay={700}>
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
              <Stack>
                <Text>- Must be unique</Text>
                <Text>- Lowercase Letters (a-z)</Text>
                <Text>- Numbers (0-9)</Text>
                <Text>- Dots (.)</Text>
                <Text>- Underscores (_)</Text>
              </Stack>
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
        fontSize="md">
        <span>
          <AiOutlineInfoCircle />
        </span>
      </Tooltip>
    ),
    placeholder: "Institution code",
  },
];

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

const NewUserForm = () => {
  const toast = useToast();
  const router = useRouter();
  const {
    data: { user },
  } = useSession();

  const mutation = useMutation(createUserProfile, {
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
      reloadSession();
      router.push("/enrollment-status");
    },
  });

  const [codeType, setCodeType] = useState("memberCode");

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

    mutation.mutate({
      ...formValues,
      codeType,
    });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {formFields.map((f, idx) => (
        <InputGroup key={idx} className="flex flex-col">
          <Input
            value={formValues[f.name]}
            name={f.name}
            _placeholder={{ color: "#1a1b26" }}
            placeholder={f.placeholder}
            onChange={handleInputChange}
          />
          {f.rightElement && (
            <InputRightElement>{f.rightElement}</InputRightElement>
          )}
          <span className="mt-1 text-red-400">{formErrors[f.name]}</span>
        </InputGroup>
      ))}
      <Flex gap={10} alignItems="center">
        <span>Code Type</span>
        <RadioGroup
          defaultValue="memberCode"
          onChange={(v) => {
            setCodeType(v);
            setFromErrors((p) => ({ ...p, institutionCode: null }));
          }}>
          <Stack spacing={5} direction="row">
            <Radio colorScheme="blue" value="memberCode">
              Member
            </Radio>
            <Radio colorScheme="purple" value="adminCode">
              Admin
            </Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      <Button
        isLoading={mutation.isLoading}
        loadingText="creating profile"
        type="submit"
        variant="solid"
        colorScheme="purple"
        onClick={handleSubmit}>
        Join
      </Button>
      <Button
        type="button"
        variant="outline"
        colorScheme="purple"
        onClick={() => {
          signOut({ redirect: false });
        }}>
        Logout
      </Button>
    </form>
  );
};

export default NewUserForm;
