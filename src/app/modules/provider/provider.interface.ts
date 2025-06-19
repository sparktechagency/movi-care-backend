import { Model } from "mongoose"

export type IProvider = {
    name:string,
    description: string,
    facilities:string[],
    price:number,
    status:"active"|"deleted"
}

export type ProviderModel = Model<IProvider, Record<string, unknown>>