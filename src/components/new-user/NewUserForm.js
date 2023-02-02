import { newUserFormSchema } from "@/src/utils/zod_schemas";
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
  PopoverCloseButton,
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
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GoMarkGithub } from "react-icons/go";
import { GrLinkedin } from "react-icons/gr";
import { ImWarning } from "react-icons/im";

const NewUserForm = () => {
  const toast = useToast();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [codeType, setCodeType] = useState("memberCode");

  const [formValues, setFormValues] = useState({
    username: "",
    bio: "",
    institutionCode: "",
    githubLink: "",
    linkedinLink: "",
  });

  const [formErrors, setFromErrors] = useState({
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
    let zodError = newUserFormSchema.safeParse(formValues);

    // Map through the errors and get then in the right format
    if (!zodError.success) {
      let errors = {};

      zodError.error.issues.forEach((e) => {
        errors[e.path[0]] = e.message;
      });

      setFromErrors((p) => ({ ...p, ...errors }));

      return;
    }

    setLoading(true);

    const response = await fetch("/api/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formValues,
        codeType,
      }),
    });

    if (response.ok) {
      toast({
        title: "Updated Profile",
        description: "Your journey starts here!!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push("/home");
    } else {
      const error = await response.json();

      if (error.ref) {
        setFromErrors((p) => ({ ...p, [error.ref]: error.error }));
      } else {
        toast({
          title: error.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <InputGroup className="flex flex-col">
        <Input
          name="username"
          isInvalid={formErrors.username}
          errorBorderColor="red.200"
          variant="filled"
          placeholder="Username"
          required
          value={formValues.username}
          onChange={handleInputChange}
        />
        <InputRightElement>
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
                <PopoverHeader className="font-medium text-center">
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
        </InputRightElement>
        <span className="text-red-400 mt-1">{formErrors.username}</span>
      </InputGroup>
      <Input
        variant="filled"
        placeholder="Bio"
        value={formValues.bio}
        onChange={handleInputChange}
        name="bio"
      />
      <InputGroup className="flex flex-col">
        <Input
          variant="filled"
          name="githubLink"
          errorBorderColor="red.200"
          isInvalid={formErrors.githubLink}
          placeholder="GitHub link"
          value={formValues.githubLink}
          onChange={handleInputChange}
        />
        <InputRightElement>
          <GoMarkGithub />
        </InputRightElement>
        <span className="text-red-400 mt-1">{formErrors.githubLink}</span>
      </InputGroup>
      <InputGroup className="flex flex-col">
        <Input
          errorBorderColor="red.200"
          variant="filled"
          isInvalid={formErrors.linkedinLink}
          placeholder="LinkedIn link"
          value={formValues.linkedinLink}
          onChange={handleInputChange}
          name="linkedinLink"
        />
        <InputRightElement>
          <GrLinkedin />
        </InputRightElement>
        <span className="text-red-400 mt-1">{formErrors.linkedinLink}</span>
      </InputGroup>
      <InputGroup className="flex flex-col">
        <Input
          name="institutionCode"
          isInvalid={formErrors.institutionCode}
          errorBorderColor="red.200"
          variant="filled"
          placeholder="Institution code"
          required
          value={formValues.institutionCode}
          onChange={handleInputChange}
        />
        <InputRightElement>
          <Tooltip
            placement="right"
            label="Enter the unique code of the institution you belong to!"
            fontSize="md">
            <span>
              <AiOutlineInfoCircle />
            </span>
          </Tooltip>
        </InputRightElement>
        <span className="text-red-400 mt-1">{formErrors.institutionCode}</span>
      </InputGroup>
      <Flex gap={10} alignItems="center">
        <span>Code Type</span>
        <RadioGroup
          defaultValue="memberCode"
          onChange={(v) => {
            setCodeType(v);
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
        isLoading={loading}
        loadingText="creating profile"
        type="submit"
        variant="solid"
        colorScheme="purple"
        onClick={handleSubmit}>
        Join
      </Button>
    </form>
  );
};

export default NewUserForm;
