import { Model } from "mongoose";

export type IClient = {
    image:string;
    metadata?:string;
}

export type ClientModel = Model<IClient>