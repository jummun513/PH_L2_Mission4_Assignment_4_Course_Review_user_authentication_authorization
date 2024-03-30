import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

export const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorMessage = `${err.value} is not a valid ID!`;
  return {
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Invalid ID',
    errorMessage: errorMessage,
  };
};
