import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utilities/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/auth/auth.interface';
import { AuthUserRegister } from '../modules/auth/auth.model';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Token is not available!');
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as JwtPayload;

      // prevent data access by token when user is deleted
      const isUserExist = await AuthUserRegister.findOne({ _id: decoded._id });

      if (!isUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This user does not exist!');
      }

      if (isUserExist?.isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
      }

      if (requiredRole && !requiredRole.includes(decoded.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          `Only ${requiredRole.join(', ')} allows!`,
        );
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default auth;
