/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { categoryServices } from './category.service';
import sendResponse from '../../utilities/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utilities/catchAsync';

const createCategory = catchAsync(async (req, res) => {
  const data = req.body;

  // call service function to create a new category
  const result = await categoryServices.createCategoryIntoDB({
    ...data,
    createdBy: req?.user._id,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category is created successfully.',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  // call service function to get all categories
  const result = await categoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Categories are retrieved successfully',
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategories,
};
