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
      status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active',
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
        default: 0,
      }
})

export const Service = mongoose.model<IService,ServiceModel>("services", serviceSchema);