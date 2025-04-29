import { z } from "zod";

const createProviderZodSchema = z.object({
body: z.object({
        name: z.string(),
        description: z.string(),
        facilities: z.string(),
        image: z.any(),
        price: z.string(),
        service: z.string(), // Assuming ObjectId is represented as a string
})
});

const createUpdateProviderZodSchema = z.object({
body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        facilities: z.string().optional(),
        image: z.string().optional(),
        price: z.string().optional(),
        service: z.string().optional(), // Assuming ObjectId is represented as a string
})
});

export const ProviderValidation = {
    createProviderZodSchema,
    createUpdateProviderZodSchema,
};