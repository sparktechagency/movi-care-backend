import mongoose, { Schema } from "mongoose";
import { IService, ServiceModel } from "./service.interface";
import { SERVICES_TYPE } from "../../../enums/services";

const serviceSchema = new Schema<IService,ServiceModel>({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    facilities:{
        type:[String],
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["active","deleted"],
        default:"active",
        required:true
    },
    service:{
        type:String,
        enum:Object.values(SERVICES_TYPE),
        required:true
    }
},{
    timestamps:true
})

export const Service = mongoose.model<IService,ServiceModel>("Service",serviceSchema)