import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DisclaimerService } from "./disclaimer.service";
import sendResponse from "../../../shared/sendResponse";

const createDisclaimer = catchAsync(
    async (req:Request,res:Response)=>{
        const result=await DisclaimerService.createDisclaimerToDB(req.body);
        sendResponse(res,{
            statusCode:201,
            success:true,
            message:'Disclaimer created successfully',
            data:result
        })
    }
)
const getAllDisclaimers=catchAsync(async(req:Request,res:Response)=>{
    const type = req.query.type as string;
    const result= await DisclaimerService.getDisclaimerFromDB(type);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'All disclaimer fetched successfully',
        data:result
    })
})
export const DisclaimerController={createDisclaimer,getAllDisclaimers}