/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TPasswordChange, TUserLogin, TUserRegister } from './auth.interface';
import { AuthUserRegister } from './auth.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

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

  // create signIn token
  const jwtPayload = {
    _id: (isUserExist as any)._id,
    role: isUserExist.role,
    email: isUserExist.email,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '30d',
  });
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

  return { user: sendData, token: accessToken };
};

const changePasswordIntoDB = async (
  payload: TPasswordChange,
  user: JwtPayload,
) => {
  const isUserExist = await AuthUserRegister.findOne({
    _id: user?._id,
    role: user?.role,
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user does not exist!');
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
  }

  const isCurrentPasswordMatch = await AuthUserRegister.isPasswordMatched(
    payload?.currentPassword,
    isUserExist?.password,
  );

  if (!isCurrentPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Current password wrong!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await AuthUserRegister.findOneAndUpdate(
    {
      _id: user?._id,
      role: user?.role,
    },
    { password: newHashedPassword },
    { new: true, runValidators: true },
  );

  const sendData = (result as any).toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc: any, ret: any) => {
      delete ret.isDeleted;
      delete ret.password;
      delete ret.__v;
    },
  });

  return sendData;
};

export const authService = {
  registerUserIntoDB,
  loginUserFromDB,
  changePasswordIntoDB,
};
