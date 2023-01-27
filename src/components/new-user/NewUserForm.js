import { newUserFormSchema } from "@/src/utils/zod_schemas";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GoMarkGithub } from "react-icons/go";
import { GrLinkedin } from "react-icons/gr";

const NewUserForm = () => {
  const toast = useToast();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [codeType, setCodeType] = useState("memberCode");

  const [formValues, setFormValues] = useState({
    bio: "",
    institutionCode: "",
    githubLink: "",
    linkedinLink: "",
  });

  const [formErrors, setFromErrors] = useState({
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

    let zodError = newUserFormSchema.safeParse(formValues);

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
      toast({
        title: "Enter a valid institution code!!",
        description: "Contact the your institution admin to know more!!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
            placement="auto-start"
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
