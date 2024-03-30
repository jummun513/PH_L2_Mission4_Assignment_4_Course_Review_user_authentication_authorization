/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const errorMessage = `${Object.values(err.keyValue)[0]} is a duplicate value.`;
  return {
    statusCode: StatusCodes.CONFLICT,
    message: 'Duplicate Entry',
    errorMessage: errorMessage,
  };
};
