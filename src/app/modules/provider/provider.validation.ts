import { z } from "zod";

const createProviderZodSchema = z.object({
body: z.object({
        name: z.string(),
        description: z.string(),
        facilities: z.array(z.string()),
        image: z.any(),
        price: z.number(),
})
});

const createUpdateProviderZodSchema = z.object({
body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        facilities: z.array(z.string()).optional(),
        image: z.string().optional(),
        price: z.number().optional(),
})
});

export const ProviderValidation = {
    createProviderZodSchema,
    createUpdateProviderZodSchema,
};