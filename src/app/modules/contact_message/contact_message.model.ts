import mongoose, { Schema } from "mongoose";
import { ContactMessageModel, IContactMessage } from "./contact_massage.interface";

const contactMessageSchema = new Schema<IContactMessage,ContactMessageModel>({
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    read:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["active","deleted"],
        default:'active'
    }
},{
    timestamps:true
})

export const ContactMessage= mongoose.model<IContactMessage,ContactMessageModel>('ContactMessage',contactMessageSchema)