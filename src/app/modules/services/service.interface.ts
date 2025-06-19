import { Model } from "mongoose";


export type IService = {
    name: string;
    description: string;
    image: string;
    adults_price:number;
    kids_price:number;
    service_price?:number;
    price_per_km?:number;
    price_per_hour?:number;
    taxs?:number;
    fixed_price?:number;
    button_text?:string;

}

export type ServiceModel = Model<IService>