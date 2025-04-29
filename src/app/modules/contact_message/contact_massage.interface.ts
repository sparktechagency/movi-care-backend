import { Model } from "mongoose";

export type IContactMessage = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  read?: boolean;
  status?:"active"|"deleted";
};


export type ContactMessageModel = Model<IContactMessage>