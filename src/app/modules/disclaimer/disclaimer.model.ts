import mongoose from "mongoose";
import { DisclaimerModel, IDisclaimer } from "./disclaimer.interface";
import { DISCLAIMER_TYPE } from "../../../enums/disclaimer";

const disclaimerSchema = new mongoose.Schema<IDisclaimer,DisclaimerModel>({
    content:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:Object.values(DISCLAIMER_TYPE),
    }
},{timestamps:true})

export const Disclaimer=mongoose.model<IDisclaimer,DisclaimerModel>('disclaimer',disclaimerSchema);