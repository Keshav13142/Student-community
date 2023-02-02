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
