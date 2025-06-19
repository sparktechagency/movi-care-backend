import { Model } from "mongoose";

export type IFacility = {
    image: string;
    title: string;
    description: string;
}

export type FacilityModel = Model<IFacility>;