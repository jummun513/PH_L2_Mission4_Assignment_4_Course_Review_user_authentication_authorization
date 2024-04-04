/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUserLogin, TUserRegister } from './auth.interface';
import { AuthUserRegister } from './auth.model';

const registerUserIntoDB = async (user: TUserRegister) => {
  const result = await AuthUserRegister.create(user);

  // send selective data to frontend
  const sendData = result.toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.isDeleted;
      delete ret.password;
      delete ret.__v;
    },
  });
  return sendData;
};

const loginUserFromDB = async (payload: TUserLogin) => {
  const isUserExist = await AuthUserRegister.isUserExistByUsername(
    payload?.username,
  );
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This username does not exist!');
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
  }

  const isPasswordMatch = await AuthUserRegister.isPasswordMatched(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Wrong Password!');
  }

  // send selective data to frontend
  const sendData = (isUserExist as any).toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc: any, ret: any) => {
      delete ret.isDeleted;
      delete ret.password;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  });
  return sendData;
};

export const authService = {
  registerUserIntoDB,
  loginUserFromDB,
};
