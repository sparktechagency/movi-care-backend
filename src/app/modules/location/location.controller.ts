import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { LocationService } from "./location.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getCities = catchAsync(async (req: Request, res: Response) => {
    const {latitude,longitude}=req.query
   
    const result = await LocationService.getCitiesFromApi(latitude as string,longitude as string);

    sendResponse(res, {
      success: true,    
      statusCode: StatusCodes.OK,
      message: 'Cities retrieved successfully',
      data: result,
    });
  });

  
const getLocationByQuardiant = catchAsync(async (req: Request, res: Response) => {
    const {latitude,longitude}=req.query;
    const result = await LocationService.getLocationInfoByQuardiant(latitude as string,longitude as string);
    sendResponse(res, {
        success: true,    
        statusCode: StatusCodes.OK,
        message: 'Location data retrieved successfully',
        data: result,
      });
});

const travelGeneralInfo = catchAsync(async (req: Request, res: Response) => {
    const {from,to}=req.body;
    const result = await LocationService.getTravelGeneralInfo(from,to)
    sendResponse(res, {
        success: true,    
        statusCode: StatusCodes.OK,
        message: 'Location data retrieved successfully',
        data: result,
      });
});

export const LocationController = {
    getCities,
    getLocationByQuardiant,
    travelGeneralInfo
}