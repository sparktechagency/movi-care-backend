import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ContactMessageService } from "./contact_message.service";
import sendResponse from "../../../shared/sendResponse";

const createMessage = catchAsync(
    async (req:Request,res:Response)=>{
        const body=req.body;
        const result=await ContactMessageService.creataContactMessageToDB(body);
        sendResponse(res,{
            statusCode:201,
            success:true,
            message:"message created successfully",
            data:result
        })
    } )

const getAllMessages = catchAsync(
    async(req:Request,res:Response)=>{
    const query=req.query;
    const result= await ContactMessageService.getAllContactMessagesFromDB(query);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"messages fetched successfully",
        data:result.data,
        pagination:result.paginationResult
    })}
)

const readMessage = catchAsync(
    async(req:Request,res:Response)=>{
        const id = req.params.id
        const result = await ContactMessageService.readMessage(id)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Read Successfully",
            data:result
        })
    }
)

const readAllMessages = catchAsync(
    async (req:Request,res:Response)=>{
        const result = await ContactMessageService.readAllMessages()
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Read All Messages Successfully",
            data:result
        })
    }
)

const deleteMessage= catchAsync(
    async(req:Request,res:Response)=>{
        const id = req.params.id
        const result = await ContactMessageService.deleteMessage(id)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Deleted Successfully",
            data:result
        })
    }
)

const getSingleMessage = catchAsync(
    async(req:Request,res:Response)=>{
        const id = req.params.id
        const result = await ContactMessageService.singleMessage(id)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Get Single Message Successfully",
            data:result
        })
    }
)
export const ContactMessageController={
    createMessage,
    getAllMessages,
    readMessage,
    readAllMessages,
    deleteMessage,
    getSingleMessage
}