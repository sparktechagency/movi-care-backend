import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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

const getUSerBookings= catchAsync(
    async(req:Request,res:Response)=>{
        const user:any = req.user;
        const result =await BookingService.getAllBookingsByUser(user!.id as any,req.query);
        sendResponse(res,{
            statusCode:200,
            message:'User bookings fetched successfully',
            success:true,
            data:result
        })
    }
)

const getAllBookings =catchAsync(
    async(req:Request,res:Response)=>{
        const result =await BookingService.getAllBookings(req.query);
        sendResponse(res,{
            statusCode:200,
            message:'All Bookings fetched successfully',
            success:true,
            data:result
        })
    }
)

const changeStatus = catchAsync(
    async (req:Request,res:Response)=>{
        const id=req.params.id;
        const status=req.body.status;
        const user = req.user;
        const result =await BookingService.changeStatus(id,status,user!);
        sendResponse(res,{
            statusCode:200,
            message:result.message,
            success:true,
            data:result.data
        })
    }
)

const getBooking = catchAsync(
    async(req:Request,res:Response)=>{
        const id=req.params.id;
        const user = req.user;
        const result =await BookingService.getSingleBooking(id as any)
        sendResponse(res,{
            statusCode:200,
            message:'Booking fetched successfully',
            success:true,
            data:result
        })
    }
)

const getSlotsOfMonths = catchAsync(
    async (req:Request,res:Response)=>{
        const month=req.query.month;
        const result =await BookingService.getBookeSlotByMonth(month as string);
        sendResponse(res,{
            statusCode:200,
            message:'Booking slots fetched successfully',
            success:true,
            data:result
        })
    }
)
export const BookingController={
    bookingService,
    getUSerBookings,
    getAllBookings,
    changeStatus,
    getBooking,
    getSlotsOfMonths
}