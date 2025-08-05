import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { ...verifyData } = req.body;
  const result = await AuthService.verifyEmailToDB(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully.',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      'Please check your email. We have sent you a one-time passcode (OTP).',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  console.log(token);
  
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token!, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully reset.',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user!, passwordData);

  sendResponse(res, {
    success: false,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully changed',
  });
});

const googleSignIn = catchAsync(async (req: Request, res: Response) => {
  
  const result = await AuthService.googleSignInToDB(req.user);
  const response = res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  const resoponse = response.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

 return resoponse.redirect(`${config.url.frontend_url}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.body.refreshToken;
  const result = await AuthService.refreshAccessTokenDB(token!)
  sendResponse(res,{
    statusCode:200,
    success:true,
    message:'Refreshed Token Successfully',
    data:result
  })
});
export const AuthController = {
  verifyEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  googleSignIn,
  refreshToken
};
