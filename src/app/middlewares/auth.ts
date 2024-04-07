import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utilities/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/auth/auth.interface';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Token is not available!');
    }

    try {
      const decoded = jwt.verify(token, config.jwt_secret as string);
      if (
        requiredRole &&
        !requiredRole.includes((decoded as JwtPayload)?.role)
      ) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          `Only ${requiredRole.join(', ')} allows!`,
        );
      }
      req.user = decoded as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default auth;
