import { Model } from "mongoose";


export type IService = {
    name: string;
    description: string;
    image: string;
    status:"active"|"deleted";
    adults_price:number;
    kids_price:number;
    service_price?:number;
    
}

export type ServiceModel = Model<IService>