import { z } from "zod";
import { BookingStatus } from "../../../enums/booking";

const createBookingZodSchema = z.object({
  body: z.object({
    service: z.string(), // MongoDB ObjectId as string
    provider: z.string(),
    date: z.string(),
    time: z.string(), 
    pickup_location: z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
    dropoff_location: z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }),
    total_amount: z.number(),
    base_fare: z.number(),
    service_charge: z.number(),
    additional_travelerse_fee: z.number(),
    kids: z.number().min(0),
    adults: z.number().min(1),
    tax: z.number(),
    additional_info: z.string().optional(),
    total_price: z.number().optional(),
  }),
})

const updateBookingZodSchema = z.object({
    body: z.object({
        status: z.nativeEnum(BookingStatus),
    })
})
const getSlotsZodSchema = z.object({
    query: z.object({
        month: z.string()
    })
}
)
export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
  getSlotsZodSchema,
};