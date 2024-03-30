import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorMessage = err.issues
    .map(
      (issue: ZodIssue) => `${issue?.path[issue?.path.length - 1]} is required`,
    )
    .join('. ');
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Validation Error',
    errorMessage: errorMessage,
  };
};
