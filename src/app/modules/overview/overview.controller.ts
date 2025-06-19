import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OverviewService } from "./overview.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getUsersAndEarnings = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
  const result = await OverviewService.usersAndEarningsOverView(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users and earnings overview fetched successfully',
    data: result,
  });
});


export const OverviewController = {
  getUsersAndEarnings,
};