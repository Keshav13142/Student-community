import { updateInstitutionInfo } from "@/lib/api-calls/institution";
import { parseZodErrors, updateInstitutionSchema } from "@/lib/validations";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";

const formFields = [
  { name: "name", icon: null, placeholder: "Institution Name" },
  { name: "website", icon: <AiOutlineLink />, placeholder: "Website link" },
  {
    name: "supportEmail",
    icon: <MdAlternateEmail />,
    placeholder: "Support email",
  },
  { name: "image", icon: <BsFillImageFill />, placeholder: "Image link" },
];

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
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutInstitution"] });
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

    const parsedInputs = updateInstitutionSchema.safeParse(inputs);

    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate({ ...inputs, institutionId: data.id });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {formFields.map((f, idx) => (
        <div key={idx} className="flex flex-col">
          <span className="mb-1 font-medium">{f.placeholder}</span>
          <InputGroup>
            <Input
              value={inputs[f.name]}
              name={f.name}
              placeholder={f.placeholder}
              onChange={handleInputChange}
            />
            {f.icon && <InputRightElement>{f.icon}</InputRightElement>}
            <span className="mt-1 text-red-400">{errors[f.name]}</span>
          </InputGroup>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-center gap-3">
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
    </form>
  );
};

export default EditInstitutionInfo;
