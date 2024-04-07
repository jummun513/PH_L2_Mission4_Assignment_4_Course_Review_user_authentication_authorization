/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../utilities/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utilities/catchAsync';
import { authService } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const data = req.body;

  // call service function to create a new course
  const result = await authService.registerUserIntoDB(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const data = req.body;

  // call service function to create a new course
  const result = await authService.loginUserFromDB(data);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User login successful',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  // call service function to create a new course
  const result = await authService.changePasswordIntoDB(data, user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password is changed successfully!',
    data: result,
  });
});

export const authControllers = {
  registerUser,
  loginUser,
  changePassword,
};
