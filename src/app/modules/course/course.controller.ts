/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../utilities/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utilities/catchAsync';
import { courseServices } from './course.service';

const getBestCourse = catchAsync(async (req, res) => {
  // call service function to get all categories
  const result = await courseServices.getBestCourseFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

export const courseControllers = {
  getBestCourse,
};
