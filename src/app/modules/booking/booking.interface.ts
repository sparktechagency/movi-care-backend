import { Model, ObjectId } from "mongoose";
import { SERVICES_TYPE } from "../../../enums/services"
import { BookingStatus } from "../../../enums/booking";

export type IBooking = {
    service:ObjectId;
    user:ObjectId;
    provider:ObjectId;
    date:Date;
    pickup_location:string;
    dropoff_location:string;
    status:BookingStatus
    total_amount:number;
    payment_status:'paid' | 'unpaid';
    base_fare:number;
    service_charge:number;
    additional_travelerse_fee:number;
    kids:number,
    adults:number;
    tax:number;
    formatted_date?:Date;
    payment_intent_id?:string;
    additional_info?:string
    total_price :number;
    order_id?:string;
    createdAt?:string;
    updatedAt?:string;
    distance:number;
    duration:number
    pickup_time:Date;
    dropoff_time:Date;
    transaction_id?:string;
    refund_status?:"pending" | "refunded"

}

export type BookingModel = Model<IBooking>