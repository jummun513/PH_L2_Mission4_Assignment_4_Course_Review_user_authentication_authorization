/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

export const handleJwtError = (err: any): TGenericErrorResponse => {
  return {
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'Unauthorized Access',
    errorMessage:
      'You do not have the necessary permissions to access this resource.',
  };
};
