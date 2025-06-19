import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ClientService } from "./client.service";
import { StatusCodes } from "http-status-codes";
import { getSingleFilePath } from "../../../shared/getFilePath";

const createClient = catchAsync(async (req: Request, res: Response) => {
  const { ...clientData } = req.body;
  const image = getSingleFilePath(req.files, 'image')
  const result = await ClientService.createClientIntoDB({
    ...clientData,
    image,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Client created successfully',
    data: result,
  });
  });
const getAllClients = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
    const result = await ClientService.getAllClientsFromDB(query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Clients fetched successfully',
      data: result.data,
      pagination: result.paginatedResult,
    });
  });

  const updateClient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = getSingleFilePath(req.files, 'image')
    const updatedData = req.body;
    const result = await ClientService.updateClientIntoDB(id, {
      ...updatedData,
      image,
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Client updated successfully',
      data: result,
    });
  });

  const deleteClient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ClientService.deleteClientFromDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Client deleted successfully',
      data: result,
});
});
export const ClientController = {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
};