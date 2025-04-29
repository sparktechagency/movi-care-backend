import { Model, ObjectId } from "mongoose";
import { SERVICES_TYPE } from "../../../enums/services"
import { BookingStatus } from "../../../enums/booking";

export type IBooking = {
    service:ObjectId;
    user:ObjectId;
    provider:ObjectId;
    date:string;
    time:string;
    pickup_location:{
        name:string;
        latitude:number;
        longitude:number;
    };
    dropoff_location:{
        name:string;
        latitude:number;
        longitude:number;
    };
    status:BookingStatus
    total_amount:number;
    payment_status:'paid' | 'unpaid';
    base_fare:number;
    service_charge:number;
    additional_travelerse_fee:number;
    kids:number,
    adults:number;
    tax:number;
    formatted_date?:string;
    payment_intent_id?:string;
    additional_info?:string
    total_price?:number;

}

export type BookingModel = Model<IBooking>