import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ServiceService } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import { getSingleFilePath } from "../../../shared/getFilePath";
import unlinkFile from "../../../shared/unlinkFile";

const createService = catchAsync(
    async (req:Request,res:Response)=>{
        const data = req.body;
        const imagePath = getSingleFilePath(req.files,'image')
        const result = await ServiceService.createServiceIntoDB({
            ...data,image:imagePath
        });
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:"Service created successfully",
            data:result
        })
    }
)

const getAllServices = catchAsync(
    async (req:Request,res:Response)=>{
        const result = await ServiceService.getAllServicesFromDB();
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:"All services fetched successfully",
            data:result
        })
    }
)

const getSerice = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const result = await ServiceService.getSingleServiceFromDB(id);
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:"Service fetched successfully",
            data:result
        })
    }
)

const updateService = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const data = req.body;
        const dataItem = await ServiceService.getSingleServiceFromDB(id);
        if(!dataItem){
            throw new Error("No service found")
        }

            const imagePath = getSingleFilePath(req.files,'image');
            if(imagePath && dataItem?.image){
                unlinkFile(dataItem.image)
                data.image=imagePath;
            }
        
        const result = await ServiceService.updateServiceIntoDB(id,data);
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:"Service updated successfully",
            data:result
        })
    }
)

const deleteService = catchAsync(
    async (req:Request,res:Response)=>{
        const id = req.params.id;
        const result = await ServiceService.deleteServiceFromDB(id);
        sendResponse(res,{
            statusCode : 201,
            success:true,
            message:"Service deleted successfully",
            data:result
        })
    }
)

export const ServiceController={
    createService,
    getAllServices,
    getSerice,
    updateService,
    deleteService
}