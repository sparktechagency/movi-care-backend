import { date, z } from "zod";
import { BookingStatus } from "../../../enums/booking";

const createBookingZodSchema = z.object({
  body: z.object({
    service: z.string(), // MongoDB ObjectId as string
    provider: z.string(),
    date: z.string(),
    pickup_location: z.string(),
    dropoff_location: z.string(),
     base_fare: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    service_charge: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    additional_travelerse_fee: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    kids: z.number().optional(),
    adults: z.number().optional(),
    tax: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    additional_info: z.string().optional(),
    total_price: z.number().optional(),
    distance: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    duration: z.number().positive().transform(value => parseFloat(value.toFixed(2))),
    pickup_time: z.string(),
  }),
})

const updateBookingZodSchema = z.object({
    body: z.object({
        status: z.nativeEnum(BookingStatus),
    })
})


const createRebookZodSchema = z.object({
    body: z.object({
        date: z.string(),
        pickup_time: z.string()
    })
})


const createCheckZodSchema = z.object({
    body: z.object({
        date: z.string(),
        time: z.string(),
        pickup_location: z.string(),
        dropoff_location: z.string(),
    })
})


const getDateTimeSlotsZodSchema = z.object({
    query: z.object({
        date: z.string()
    })
})
export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
  createRebookZodSchema,
  getDateTimeSlotsZodSchema,
  createCheckZodSchema
};