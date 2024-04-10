/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { handleZodError } from '../errors/handleZodError';
import { handleValidationError } from '../errors/handleValidationError';
import { handleCastError } from '../errors/handleCastError';
import { handleDuplicateError } from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { handleJwtError } from '../errors/handleJwtError';

type TResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  errorMessage: string;
  errorDetails: any;
  stack: string | null;
  data: any;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: Partial<TResponse> = { success: false };
  response.message = 'Something Went Wrong!';
  response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  response.errorMessage = '';
  response.errorDetails = err;
  response.stack = err?.stack || null;

  if (err instanceof ZodError) {
    // zod validation error
    const simplifiedError = handleZodError(err);
    response.statusCode = simplifiedError.statusCode;
    response.message = simplifiedError.message;
    response.errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'ValidationError') {
    // mongoose validation error
    const simplifiedError = handleValidationError(err);
    response.statusCode = simplifiedError.statusCode;
    response.message = simplifiedError?.message;
    response.errorMessage = simplifiedError?.errorMessage;
    response.errorDetails = err?.errors;
  } else if (err?.name === 'CastError') {
    // mongoDb find by Id not found error
    const simplifiedError = handleCastError(err);
    response.statusCode = simplifiedError.statusCode;
    response.message = simplifiedError?.message;
    response.errorMessage = simplifiedError?.errorMessage;
  } else if (err?.code === 11000) {
    // mongoDb unique key validation error
    const simplifiedError = handleDuplicateError(err);
    response.statusCode = simplifiedError.statusCode;
    response.message = simplifiedError?.message;
    response.errorMessage = simplifiedError?.errorMessage;
  } else if (err instanceof AppError) {
    // throw new Error/AppError handle
    response.statusCode = err?.statusCode;
    response.message = 'App Error';
    response.errorMessage = err?.message;
  } else if (
    err instanceof JsonWebTokenError ||
    err instanceof TokenExpiredError ||
    err instanceof NotBeforeError
  ) {
    const simplifiedError = handleJwtError(err);
    response.statusCode = simplifiedError.statusCode;
    response.message = simplifiedError?.message;
    response.errorMessage = simplifiedError?.errorMessage;
    response.errorDetails = null;
    response.stack = null;
  } else if (err.message === 'passwordError') {
    response.statusCode = StatusCodes.BAD_REQUEST;
    response.message =
      'Password change failed. Ensure the new password is unique and not among the last 2 used (last used on 2023-01-01 at 12:00 PM).';
    delete response.errorMessage;
    delete response.errorDetails;
    delete response.stack;
    response.data = null;
  }

  // stack: config.node_env === 'development' ? err?.stack : null,
  return res.status(response.statusCode).json(response);
};

export default globalErrorHandler;
