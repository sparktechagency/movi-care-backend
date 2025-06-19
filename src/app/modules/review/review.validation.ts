import { z } from "zod";

const createReviewZodSchema = z.object({
    body: z.object({
        comment: z.string({
            required_error: 'Comment is required',
        }),
        rating: z.number({
            required_error: 'Rating is required',
        }),
        booking: z.string({
            required_error: 'Booking is required',
        })
    }),
});

export const ReviewValidation = {
    createReviewZodSchema,
};