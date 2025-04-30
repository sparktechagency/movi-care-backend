import { nativeEnum, z } from "zod";
import { DISCLAIMER_TYPE } from "../../../enums/disclaimer";

const createDisclaimerZodSchema = z.object({
  body: z.object({
    content: z.string(),
    type: z.nativeEnum(DISCLAIMER_TYPE),
  }),
})

const getDisclaimerZodSchema = z.object({
  query: z.object({
    type: nativeEnum(DISCLAIMER_TYPE),
  })
}
)

export const DisclaimerValidation = {
  createDisclaimerZodSchema,
  getDisclaimerZodSchema
}