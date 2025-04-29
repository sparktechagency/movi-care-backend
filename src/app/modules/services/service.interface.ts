import { Model } from "mongoose";
import { SERVICES_TYPE } from "../../../enums/services";

export type IService = {
    title: string;
    description: string;
    image: string;
    facilities: string[];
    price: number;
    status:"active"|"deleted"
    service:SERVICES_TYPE
}

export type ServiceModel = Model<IService>