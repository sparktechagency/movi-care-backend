import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";

const bookingService = catchAsync(
    async (req:Request,res:Response)=>{
        const data = req.body;
        const user = req.user
        const result = await BookingService.bookServiceToDB(data,user!)
        sendResponse(res,{
            statusCode : 201,
            message:"Booking Successfull",
            success:true,
            data:result
        })
    }
)

export const BookingController={
    bookingService
}