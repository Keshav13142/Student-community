import { updateInstitutionInfo } from "@/src/utils/api-calls";
import { parseZodErrors, updateInstitutionForm } from "@/src/utils/zod_schemas";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";

const initialErrors = {
  name: null,
  image: null,
  website: null,
  supportEmail: null,
};

const EditInstitutionInfo = ({ data, onCancel }) => {
  const initialInputs = {
    name: data?.name,
    image: data?.image || "",
    website: data?.website || "",
    supportEmail: data?.supportEmail || "",
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(updateInstitutionInfo, {
    onError: () => {
      toast({
        title: "Failed to update!!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["aboutInstitution"], () => data);
      onCancel();
    },
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const parsedInputs = updateInstitutionForm.safeParse(inputs);

    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate({ ...inputs, institutionId: data.id });
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={4}>
        <InputGroup className="flex flex-col">
          <Input
            value={inputs.name}
            name="name"
            _placeholder={{ color: "#1a1b26" }}
            placeholder="Institution Name"
            onChange={handleInputChange}
          />
          <span className="text-red-400 mt-1">{errors.name}</span>
        </InputGroup>
        <InputGroup className="flex flex-col">
          <Input
            value={inputs.website}
            name="website"
            _placeholder={{ color: "#1a1b26" }}
            onChange={handleInputChange}
            placeholder="Website"
          />
          <InputRightElement>
            <AiOutlineLink />
          </InputRightElement>
          <span className="text-red-400 mt-1">{errors.website}</span>
        </InputGroup>
        <InputGroup className="flex flex-col">
          <Input
            value={inputs.supportEmail}
            name="supportEmail"
            _placeholder={{ color: "#1a1b26" }}
            onChange={handleInputChange}
            placeholder="Support email"
          />
          <InputRightElement>
            <MdAlternateEmail />
          </InputRightElement>
          <span className="text-red-400 mt-1">{errors.supportEmail}</span>
        </InputGroup>
        <InputGroup className="flex flex-col">
          <Input
            value={inputs.image}
            name="image"
            _placeholder={{ color: "#1a1b26" }}
            onChange={handleInputChange}
            placeholder="Image link"
          />
          <InputRightElement>
            <BsFillImageFill />
          </InputRightElement>
          <span className="text-red-400 mt-1">{errors.image}</span>
        </InputGroup>
        <Flex alignSelf="center" gap={3}>
          <Button
            disabled={mutation.isLoading}
            colorScheme="red"
            variant="outline"
            onClick={onCancel}
            type="button">
            Cancel
          </Button>
          <Button
            disabled={mutation.isLoading}
            variant="outline"
            color="cadetblue"
            onClick={() => {
              setInputs(initialInputs);
              setErrors(initialErrors);
            }}>
            Reset
          </Button>
          <Button
            isLoading={mutation.isLoading}
            colorScheme="purple"
            type="submit">
            Submit
          </Button>
        </Flex>
      </Stack>
    </form>
  );
};

export default EditInstitutionInfo;
