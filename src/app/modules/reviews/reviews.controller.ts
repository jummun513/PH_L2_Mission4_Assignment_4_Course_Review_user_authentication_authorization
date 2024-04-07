/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../utilities/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utilities/catchAsync';
import { reviewServices } from './reviews.service';

const createReview = catchAsync(async (req, res) => {
  const data = req.body;

  // call service function to create a new review
  const result = await reviewServices.createReviewIntoDB({
    ...data,
    createdBy: req?.user._id,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Review is created successfully.',
    data: result,
  });
});

export const reviewControllers = {
  createReview,
};
