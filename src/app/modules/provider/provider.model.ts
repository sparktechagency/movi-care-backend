import mongoose from "mongoose";
import { IProvider, ProviderModel } from "./provider.interface";

const providerSchema = new mongoose.Schema<IProvider,ProviderModel>({
    name: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    facilities:[String],
    price:{
        type:Number,
        required:true
    },
    service:{
        type:mongoose.Types.ObjectId,
        ref:'services',
        required:true
    },
    status:{
        type:String,
        enum:["active","deleted"],
        default:"active",
        required:false
    }

})

export const Provider = mongoose.model<IProvider,ProviderModel>('Provider',providerSchema)