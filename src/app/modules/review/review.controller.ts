import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import reviewService from "./review.service";
import sendResponse from "../../../shared/sendResponse";

const sendReview = catchAsync(async (req:Request, res:Response) => {
  const data = req.body;
  const user:any = req.user;
  const result = await reviewService.createReviewIntoDB({
    ...data,
    user: user.id,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review created successfully",
    data: result,
  });
})

const getAllReviews = catchAsync(async(req:Request,res:Response)=>{
const  user:any = req.user;
const query = req.query;
  const result=await reviewService.getAllReviewsFromDB(query,user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
}
)

const getFeaturesReviews = catchAsync(async(req:Request,res:Response)=>{
  const result=await reviewService.getFeaturesReviewsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
}
)

const deleteReview = catchAsync(async(req:Request,res:Response)=>{
  const {id} = req.params;
  const result=await reviewService.deleteReviewFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
}
)

const makeFeaturedReview = catchAsync(async(req:Request,res:Response)=>{
  const {id} = req.params;
  
  const result=await reviewService.makeFeaturedReviewFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
}
)
export const ReviewController={
sendReview,
getAllReviews,
getFeaturesReviews,
deleteReview,
makeFeaturedReview
}