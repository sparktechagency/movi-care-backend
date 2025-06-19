import mongoose, { Schema } from "mongoose";
import { ClientModel, IClient } from "./client.interface";

const clientSchema = new Schema<IClient,ClientModel>({
    image: {
        type: String,
        required: true,
      },
      metadata: {
        type: String,
        required: false,
      },
},
{
    timestamps: true,
})

export const Client = mongoose.model<IClient,ClientModel>("Client", clientSchema);