import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorMessage = Object.values(err.errors)
    .map(
      (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
        `${value?.path} is required`,
    )
    .join('. ');
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Validation Error',
    errorMessage: errorMessage,
  };
};
