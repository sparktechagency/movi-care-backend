import { z } from "zod";

const createContactMessageZodSchema = z.object({
  body: z.object({
    name: z.string({required_error:"name is required"}).min(1).max(256),
    email: z.string({required_error:"email is required"}).email(),
    message: z.string({required_error:"message is required"}),
    phone: z.string().optional(),
  }),
})

export const ContactMessageValidation={
createContactMessageZodSchema,
}