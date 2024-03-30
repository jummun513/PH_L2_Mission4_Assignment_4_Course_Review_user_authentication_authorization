/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../utilities/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utilities/catchAsync';
import { courseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const data = req.body;

  // call service function to create a new course
  const result = await courseServices.createCourseIntoDB(data);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Course is created successfully.',
    data: result,
  });
});

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
  createCourse,
  getBestCourse,
};
