import { ObjectId } from "mongoose";
import { SERVICES_TYPE } from "../../../enums/services"
import { BookingStatus } from "../../../enums/booking";

export type IBooking = {
    service_type:SERVICES_TYPE;
    service:ObjectId;
    user:ObjectId;
    date:string;
    time:string;
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
    formatted_date?:string;

}