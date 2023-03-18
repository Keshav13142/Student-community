import { updateCommunityInfo } from "@/lib/api-calls/community";
import { parseZodErrors, updateCommunitySchema } from "@/lib/validations";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

const formFields = [
  { name: "name", icon: null, placeholder: "Community Name" },
  { name: "desc", icon: null, placeholder: "Description" },
  { name: "image", icon: <BsFillImageFill />, placeholder: "Logo link" },
];

const initialErrors = {
  name: null,
  desc: null,
  image: null,
  type: null,
};

const EditCommunityInfo = ({ data, onCancel }) => {
  const initialInputs = {
    name: data?.name,
    desc: data?.desc || "",
    image: data?.image || "",
    type: data?.type,
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation(updateCommunityInfo, {
    onError: (error) => {
      toast({
        title: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["communityInfo", newData.slug], (prev) => ({
        ...prev,
        ...newData,
      }));
      queryClient.setQueryData(["userCommunities"], (prev) =>
        prev.map((comm) =>
          comm.id === newData.id ? { ...comm, ...newData } : comm
        )
      );
      toast({
        title: "Updated info!!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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

    const parsedInputs = updateCommunitySchema.safeParse(inputs);

    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate({ ...inputs, communityId: data.id });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
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
              {f.icon && <InputRightElement>{f.icon}</InputRightElement>}
              <span className="mt-1 text-red-400">{errors[f.name]}</span>
            </InputGroup>
          </div>
        ))}
        <RadioGroup
          defaultValue={inputs.type}
          name="type"
          onChange={(v) => {
            setInputs((p) => ({ ...p, type: v }));
          }}
        >
          <div className="fc flex gap-3">
            <p className="font-medium">Community type</p>
            <Radio value="PUBLIC">Public</Radio>
            <Radio value="PRIVATE">Private</Radio>
            <Radio value="RESTRICTED">Restricted</Radio>
          </div>
        </RadioGroup>
        <div className="flex items-center gap-3">
          <Button
            disabled={mutation.isLoading}
            colorScheme="red"
            variant="outline"
            onClick={() => {
              setInputs(initialInputs);
              setErrors(initialErrors);
              onCancel();
            }}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={mutation.isLoading}
            variant="outline"
            color="cadetblue"
            onClick={() => {
              setInputs(initialInputs);
              setErrors(initialErrors);
            }}
          >
            Reset
          </Button>
          <Button
            isLoading={mutation.isLoading}
            colorScheme="purple"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditCommunityInfo;
