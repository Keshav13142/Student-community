import { z } from "zod";

export const newUserFormSchema = z.object({
  institutionCode: z
    .string({ required_error: "Institution code is required" })
    .min(1, { message: "Enter a valid code!" }),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Enter a valid username" })
    .regex(/^[a-zA-Z0-9]+$/, "Invalid username"),
  githubLink: z
    .string()
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
  linkedinLink: z
    .string()
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const updateInstitutionForm = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Enter a valid username" }),
  website: z
    .string()
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
  supportEmail: z
    .string()
    .email({ message: "Enter a valid email" })
    .or(z.literal("")),
});

export const createCommunitySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Enter a valid name!" }),
  image: z
    .string()
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const parseZodErrors = (zodError) => {
  let errors = {};

  zodError.error.issues.forEach((e) => {
    errors[e.path[0]] = e.message;
  });

  return errors;
};
