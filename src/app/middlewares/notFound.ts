import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    StatusCode: StatusCodes.NOT_FOUND,
    message: 'API Not Found!',
  });
};

export default notFound;
