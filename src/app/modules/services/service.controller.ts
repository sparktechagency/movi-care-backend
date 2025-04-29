import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ServiceService } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import { getSingleFilePath } from "../../../shared/getFilePath";

const createService = catchAsync(
    async (req:Request,res:Response)=>{
        const data = req.body;
        const imagePath = getSingleFilePath(req.files,'image')
        const result = await ServiceService.createServiceToDB({...data,image:imagePath});
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:'Service created successfully',
            data:result
        })
    }
)

const getAllService= catchAsync(
    async(req:Request,res:Response)=>{
        const query = req.query;
        const result = await ServiceService.getAllServicesFromDB(query);
        sendResponse(res,{
            statusCode : 200,
            success:true,
            message:'All services fetched successfully',
            data:result
        })
    }
)

const getService = catchAsync(
    async(req:Request,res:Response)=>{
        const id = req.params.id;
        const result = await ServiceService.getServiceByIdFromDB(id);
        sendResponse(res,{
            statusCode : 200,
            success:true,
            message:'Single service fetched successfully',
            data:result
        })
    }
)

const updateService = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const data = req.body;
        const result = await ServiceService.updateServiceByIdFromDB(id,data);
        sendResponse(res,{
            statusCode : 200,
            success:true,
            message:'Service updated successfully',
            data:result
        })
    }
)

const deleteService = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const result = await ServiceService.deleteServiceByIdFromDB(id);
        sendResponse(res,{
            statusCode : 200,
            success:true,
            message:'Service deleted successfully',
            data:result
        })
    }
)

export const ServiceController={
    createService,
    getAllService,
    getService,
    updateService,
    deleteService
}