import { z } from "zod";

const createGeneralLocationZodSchema = z.object({
    body: z.object({
        from: z.object({
            latitude: z.number({ required_error: 'Latitude is required' }),
            longitude: z.number({ required_error: 'Longitude is required' }),
        }),
        to: z.object({
            latitude: z.number({ required_error: 'Latitude is required' }),
            longitude: z.number({ required_error: 'Longitude is required' }),
        }),
    }),
})

export const LocationValidation = {
    createGeneralLocationZodSchema
}