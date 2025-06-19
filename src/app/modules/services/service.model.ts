import mongoose, { Schema } from "mongoose";
import { IService, ServiceModel } from "./service.interface";

const serviceSchema = new Schema<IService,ServiceModel>({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      adults_price: {
        type: Number,
        required: true,
      },
      kids_price: {
        type: Number,
        required: true,
      },
      service_price: {
        type: Number,
        required: true,
      },
      price_per_km: {
        type: Number,
        default: 0,
      },
      price_per_hour: {
        type: Number,
        default: 0,
      },
      taxs: {
        type: Number,
        required: true,
      },
      fixed_price: {
        type: Number,
        required: true,
      },
      button_text: {
        type: String,
        required: true,
      },
     
},{timestamps:true})

export const Service = mongoose.model<IService,ServiceModel>("Service", serviceSchema);