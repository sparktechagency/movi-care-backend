import { model, Schema } from "mongoose";
import { FacilityModel, IFacility } from "./facility.interface";

const facilitySchema = new Schema<IFacility,FacilityModel>({
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})


export const Facility = model<IFacility,FacilityModel>('Facility',facilitySchema)