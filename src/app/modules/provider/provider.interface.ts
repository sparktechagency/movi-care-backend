import { Model, ObjectId } from "mongoose"

export type IProvider = {
    name:string,
    description: string,
    facilities:string[],
    image:string,
    price:number,
    service:ObjectId,
    status:"active"|"deleted"
}

export type ProviderModel = Model<IProvider, Record<string, unknown>>