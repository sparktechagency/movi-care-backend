import { z } from "zod";
import { SERVICES_TYPE } from "../../../enums/services";

const createServiceZodSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        description: z.string(),
        price: z.string(),
        image: z.any(),
        service:z.nativeEnum(SERVICES_TYPE),
        facilities:z.string()
    })

}
)

const updateServiceZodSchema=z.object({
    body:z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        image: z.any().optional(),
        service:z.nativeEnum(SERVICES_TYPE).optional(),
        facilities:z.string().optional()
    })
})

export const ServiceValidation={
    createServiceZodSchema,
    updateServiceZodSchema
}