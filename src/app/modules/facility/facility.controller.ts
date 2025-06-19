import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { FacilityService } from "./facility.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { getSingleFilePath } from "../../../shared/getFilePath";
import unlinkFile from "../../../shared/unlinkFile";

const createFacility = catchAsync(async (req: Request, res: Response) => {
    const { ...facilityData } = req.body;
    const image = getSingleFilePath(req.files,'image')
    facilityData.image = image
    const result = await FacilityService.createFacility(facilityData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Facility created successfully',
        data: result,
    });
});

const getAllFacilities = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await FacilityService.getAllFacilities(query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Facilities retrieved successfully',
        data: result.data,
        pagination: result.paginationInfo
    });
});

const getSingleFacility = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FacilityService.getSingleFacility(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Facility retrieved successfully',
        data: result,
    });
});

const updateFacility = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...facilityData } = req.body;
    const image = getSingleFilePath(req.files,'image')
    const exisitFacility = await FacilityService.getSingleFacility(id)
    if(image){
        unlinkFile(exisitFacility?.image!)
        facilityData.image = image

    }
    
    const result = await FacilityService.updateFacility(id, facilityData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Facility updated successfully',
        data: result,
    });
});

const deleteFacility = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const exisitFacility = await FacilityService.getSingleFacility(id)
    if(exisitFacility?.image){
        unlinkFile(exisitFacility?.image!)
    }
    const result = await FacilityService.deleteFacility(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Facility deleted successfully',
        data: result,
    });
});

export const FacilityController = {
    createFacility,
    getAllFacilities,
    getSingleFacility,
    updateFacility,
    deleteFacility,
};