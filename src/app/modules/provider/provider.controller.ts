import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { ProviderService } from "./provider.service";
import sendResponse from "../../../shared/sendResponse";
import unlinkFile from "../../../shared/unlinkFile";

const createProvider = catchAsync(
    async (req:Request,res:Response)=>{
        const data = req.body
        const result = await ProviderService.createProvider({
            ...data,
            
        })
        sendResponse(res,{
            statusCode:201,
            success:true,
            message:'Provider created successfully',
            data:result
        })
    }
)

const getALlProvidersByService = catchAsync(
    async(req:Request,res:Response)=>{
    const serviceId = req.params.id;
    const result = await ProviderService.getAllProvidersByService(serviceId);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"All providers fetched",
        data:result
    })
}
)

const getAllProviders = catchAsync(
    async(req:Request,res:Response)=>{
    const queryResult = req.query;
    const result = await ProviderService.getAllProviders(queryResult);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"All providers fetched",
        data:result
    })
}
)

const getSingleProvider = catchAsync(
    async (req:Request,res:Response)=>{
    const id = req.params.id;
    const result = await ProviderService.getSingleProvider(id);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Provider fetched",
        data:result
    })
}
)

const updateProvider = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const provider = await ProviderService.getSingleProvider(id);
        if(!provider){
            throw new Error('Provider not found');
        }
        const data = req.body;
        const result = await ProviderService.updateProvider(id,data);
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Provider updated",
            data:result
        })
    }
)

const deleteProvider = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const result = await ProviderService.deleteProvider(id)
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Provider deleted",
            data:result
        })
    }
)
export const ProviderController={
    createProvider,
    getALlProvidersByService,
    getAllProviders,
    getSingleProvider,
    updateProvider,
    deleteProvider
}