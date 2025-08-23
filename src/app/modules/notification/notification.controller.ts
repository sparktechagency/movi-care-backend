import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { NotificationService } from './notification.service';

const createNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.createNotification(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notification created successfully',
        data: result
    });
});

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getAllNotifications(req.user!,req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notifications fetched successfully',
        data: result.data,
        pagination: result.paginationInfo
    });
});

const readSingleNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.readSingleNotification(req.user!, req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notification read successfully',
        data: result
    });
});
const readAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.readAllNotifications(req.user!);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All Notifications read successfully',
        data: result
    });
});
export const NotificationController = {
    createNotification,
    getAllNotifications,
    readSingleNotification,
    readAllNotifications
};

