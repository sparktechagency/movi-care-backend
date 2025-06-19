import { z } from "zod";

const createFacilityZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Name is required',
        }),
        description: z.string({
            required_error: 'Description is required',
        }),
        image: z.any({
            required_error: 'Image is required',
        }),
    }),
});

const updateFacilityZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Name is required',
        }),
        description: z.string({
            required_error: 'Description is required',
        }),
        image: z.any({
            required_error: 'Image is required',
        }),
    }),
});

export const FacilityValidation = {
    createFacilityZodSchema,
    updateFacilityZodSchema,
};