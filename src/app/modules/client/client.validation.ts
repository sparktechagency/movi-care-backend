import { z } from "zod";

const createClientZodSchema  = z.object({
    body: z.object({
        image: z.any(),
        metadata: z.string().optional()
    })
})

const updateClientZodSchema = z.object({
    body: z.object({
        image: z.any().optional(),
        metadata: z.string().optional()
    })
}
)
export const ClientValidation = {
    createClientZodSchema,
    updateClientZodSchema
}